import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Emergency, EmergencyStatus } from './models/Emergency.model';
import { Model } from 'mongoose';
import * as cloudinary from 'cloudinary';
import { CreateEmergencyDTO } from './dto/CreateEmergency.dto';
import { User } from 'src/users/models/User.model';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(User.name) private userModel: Model<User>,
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
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
      },
      emergencyType: body.emergencyType,
      description: body.description,
      severity: body.severity,
      photos: body.photos ?? [],
    });

    return {
      status: 200,
      message: 'Emergency successfully created',
      data: {
        emergency,
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
}
