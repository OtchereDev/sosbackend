import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Emergency, EmergencyStatus } from './models/Emergency.model';
import { Model } from 'mongoose';
import * as cloudinary from 'cloudinary';
import { CreateEmergencyDTO } from './dto/CreateEmergency.dto';
import { User } from 'src/users/models/User.model';
import { RespondersService } from 'src/responders/responders.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ResponderStatus } from 'src/responders/models/Responder.models';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { SmartApplyDTO } from './dto/SmartApply.dto';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject() private responderService: RespondersService,
    private schedulerRegistry: SchedulerRegistry,
    private firebaseService: FirebaseService,
    private embeddingService: EmbeddingService,
    private aiService: AiService,
  ) {}

  async getMyEmergency(email: string) {
    const emergencies = await this.emergencyModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $match: {
          'userDetails.email': email.toLowerCase(),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          emergencies: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      status: 200,
      emergencies,
    };
  }

  async getAllEmergency() {
    const result = await this.emergencyModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          emergencies: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return {
      result,
      status: 200,
    };
  }

  async createEmergency(body: CreateEmergencyDTO, email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });

    const [lat, long] = body.location.split(',');
    const emergency = await this.emergencyModel.create({
      user: user._id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(long), parseFloat(lat)],
      },
      locationName: body.locationName,
      emergencyType: body.emergencyType,
      description: body.description,
      severity: body.severity,
      photos: body.photos ?? [],
      // textEmbedding: await this.embeddingService.getTextEmbedding(
      //   body.description,
      // ),
    });

    this.assignResponderToEmergency({
      emergency_id: emergency._id.toString(),
      user_id: user._id.toString(),
      type: body.emergencyType,
      severity: body.severity,
      location: {
        name: body.locationName,
        longitude: parseFloat(long),
        latitude: parseFloat(lat),
      },
    });

    const { textEmbedding, ...data } = (emergency as any)._doc;

    return {
      status: 200,
      message: 'Emergency successfully created',
      data: {
        emergency: data,
      },
    };
  }

  async cancelEmergency(emergencyId: string, email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    const emergency = await this.emergencyModel.findOne({
      user: user._id,
      _id: emergencyId,
    });

    if (!emergency) {
      return {
        status: 404,
        message: 'No emergency found',
      };
    }

    await this.emergencyModel.updateOne(
      {
        _id: emergencyId,
      },
      {
        status: EmergencyStatus.CANCELLED,
      },
    );

    await this.clearEmergency(`emergency-${emergencyId}`, emergencyId);

    return {
      status: 200,
      message: 'Successfully cancelled emergency',
    };
  }

  async uploadPhoto(images: string[]) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUDNAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const uploadPromises = images.map((image) => {
      return cloudinary.v2.uploader.upload(image, {
        folder: 'emergency_photos',
        resource_type: 'image',
      });
    });

    try {
      const uploadResults = await Promise.all(uploadPromises);

      return uploadResults.map((res) => res.url);
    } catch (error) {
      console.error('Error uploading photos to Cloudinary:', error);
      throw new Error('Failed to upload photos');
    }
  }

  async getEmergency(emergencyId: string, email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });

    const emergency = await this.emergencyModel.findOne({
      _id: emergencyId,
      user: user._id,
    });

    return {
      status: 200,
      emergency,
    };
  }

  async geEmergencyResponder(emergencyId: string) {
    const emergency = await this.emergencyModel.findOne({
      _id: emergencyId,
    });

    return {
      status: 200,
      emergency,
    };
  }

  async assignResponderToEmergency(data: {
    emergency_id: string;
    user_id: string;
    type: string;
    severity: string;
    location: { name: string; longitude: number; latitude: number };
  }) {
    let currentOffset = 0;
    const name = `emergency-${data.emergency_id}`;

    const callback = async () => {
      console.log(`Interval ${name} executing with offset ${currentOffset}`);
      const responder = await this.responderService.findClosestResponder(
        data.location.longitude,
        data.location.latitude,
        data.type,
        currentOffset,
      );

      if (!responder) {
        console.log('ABANDONEDING Ememergency call admin');
        await this.firebaseService.changeActiveEmergencyStatus({
          emergency_id: data.emergency_id,
          status: 'ABANDONED',
        });

        // TODO: call on admin to handle this

        return;
      }

      await this.firebaseService.createOrUpdateActiveEmergency({
        ...data,
        responder_id: responder._id.toString(),
      });

      currentOffset += 1;
    };

    await callback();

    // Start the interval (executing every 3 minutes, or 180000 milliseconds)
    const interval = setInterval(callback, 180000);
    this.schedulerRegistry.addInterval(name, interval);
  }

  async clearEmergency(name: string, emergencyId: string) {
    console.log('Clearing emergency responder search');
    const interval = this.schedulerRegistry.getInterval(name);
    clearInterval(interval);
    this.schedulerRegistry.deleteInterval(name);

    await this.firebaseService.deleteActiveEmergency(emergencyId);
  }

  async acceptEmergency(body: { emergencyId: string; responderId: string }) {
    const emergency = await this.emergencyModel.findOne({
      _id: body.emergencyId,
    });

    if (!emergency) {
      return {
        status: 400,
        message: 'emergency not found',
      };
    }

    await this.emergencyModel.updateOne(
      {
        _id: body.emergencyId,
      },
      {
        responder: body.responderId,
        status: EmergencyStatus.INPROGRESS,
      },
    );

    await this.responderService.changeResponderStatus(
      body.responderId,
      ResponderStatus.BUSY,
    );

    await this.firebaseService.changeActiveEmergencyStatus({
      emergency_id: body.emergencyId,
      status: 'ON-ROUTE',
    });

    return {
      status: 200,
      message: 'emergency successfully accepted',
    };
  }

  async completeEmergency(body: { emergencyId: string; responderId: string }) {
    const emergency = await this.emergencyModel.findOne({
      _id: body.emergencyId,
      responder: body.responderId,
    });

    if (!emergency) {
      return {
        status: 400,
        message: 'emergency not found',
      };
    }

    await this.emergencyModel.updateOne(
      {
        _id: body.emergencyId,
      },
      {
        status: EmergencyStatus.RESOLVED,
      },
    );

    await this.responderService.changeResponderStatus(
      body.responderId,
      ResponderStatus.IDLE,
    );

    return {
      status: 200,
      message: 'emergency successfully completed',
    };
  }

  async retryEmergency(body: { emergencyId: string; userId: string }) {
    const emergency = await this.emergencyModel.findOne({
      _id: body.emergencyId,
      user: body.userId,
    });

    if (!emergency) {
      return {
        status: 400,
        message: 'emergency not found',
      };
    }

    if (!this.isMoreThanTenMinutes(emergency.retryTime)) {
      return {
        status: 400,
        message: 'You can only retry after 10 minutes. Please try again later',
      };
    }

    await this.emergencyModel.updateOne(
      {
        _id: body.emergencyId,
      },
      {
        retryTime: new Date(),
      },
    );

    this.assignResponderToEmergency({
      emergency_id: emergency._id.toString(),
      user_id: emergency.user as unknown as string,
      type: emergency.emergencyType,
      severity: emergency.severity,
      location: {
        name: emergency.locationName,
        longitude: emergency.location.coordinates[0],
        latitude: emergency.location.coordinates[1],
      },
    });

    return {
      status: 200,
      message: 'Finding you a new responder',
    };
  }

  isMoreThanTenMinutes(givenTime: Date) {
    const currentTime = new Date();
    const timeDifference = (currentTime as any) - (new Date(givenTime) as any);
    const tenMinutesInMilliseconds = 10 * 60 * 1000;

    return timeDifference > tenMinutesInMilliseconds;
  }

  async arriveAtEmergency(emergencyId: string, responderId: string) {
    try {
      await this.emergencyModel.updateOne(
        {
          _id: emergencyId,
          responder: responderId,
        },
        {
          status: EmergencyStatus.ARRIVED,
        },
      );

      await this.firebaseService.changeActiveEmergencyStatus({
        emergency_id: emergencyId,
        status: EmergencyStatus.ARRIVED,
      });

      return {
        status: 200,
        message: 'Successfully updated emergency',
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message,
      };
    }
  }

  async smartApply(body: SmartApplyDTO, email: string) {
    const aiRes = await this.aiService.chooseService(body.description);
    const [service, severity] = aiRes.selectedService.split(',');

    return await this.createEmergency(
      {
        ...body,
        severity: severity.trim(),
        photos: [],
        emergencyType: service.trim(),
      },
      email,
    );
  }
}
