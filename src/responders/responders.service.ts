import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Responder, ResponderStatus } from './models/Responder.models';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateResponderDTO } from './dto/CreateResponder.dto';
import { CurrentLocationDTO } from './dto/CurrentLocation.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class RespondersService {
  constructor(
    @InjectModel(Responder.name) private responderModel: Model<Responder>,
    @Inject() private firebaseService: FirebaseService,
  ) {}

  async findOne(email: string): Promise<Responder | undefined> {
    return await this.responderModel.findOne({ email });
  }

  async responderExists(email: string) {
    return await this.responderModel.exists({
      email,
    });
  }

  async createUser(body: CreateResponderDTO) {
    try {
      const exist = await this.responderExists(body.email);

      if (exist) {
        return {
          status: 400,
          message: 'User with this email already exists',
        };
      }

      const responder = await this.responderModel.create({
        email: body.email,
        name: body.name,
        password: this.hashPassword(body.password),
        phoneNumber: body.phoneNumber,
        type: body.type,
      });

      // TODO: Add responder to firebase
      await this.firebaseService.createResponder({
        name: body.name,
        userId: responder._id.toString(),
        email: body.email,
        longitude: 0,
        latitude: 0,
        type: body.type,
        locationName: 'DEFAULT',
      });

      return {
        status: 200,
        message: 'User successfully created',
      };
    } catch (error) {
      return {
        status: 400,
        message: error.message || 'There was an unexpected error',
      };
    }
  }

  hashPassword(password: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);

    const hPassword = bcrypt.hashSync(password, salt);

    return hPassword;
  }

  async setCurrentLocation(body: CurrentLocationDTO) {
    try {
      const [lat, long] = body.location.split(',');
      await this.responderModel.updateOne(
        {
          _id: body.userId,
        },
        {
          location: {
            type: 'Point',
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          locationName: body.locationName,
        },
      );

      return {
        status: 200,
        message: 'Successfullt updated current location',
      };
    } catch (error: any) {
      return {
        status: 400,
        message: error.message || 'Unexpected error occurred',
      };
    }
  }

  async getProfile(email: string) {
    const user: any = await this.findOne(email);

    const { password, ...result } = user._doc;

    return {
      status: 200,
      data: result,
    };
  }

  async findClosestResponder(
    longitude: number,
    latitude: number,
    type: string,
    offset: number,
    maxDistanceInMeters = 10000,
  ) {
    return await this.responderModel.findOne(
      {
        type,
        status: ResponderStatus.IDLE,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            //$maxDistance: maxDistanceInMeters, // Maximum distance in meters (optional)
          },
        },
      },
      undefined,
      { skip: offset },
    );
  }

  async changeResponderStatus(responderId: string, status: string) {
    try {
      await this.responderModel.updateOne(
        {
          _id: responderId,
        },
        { status },
      );
    } catch (error) {}
  }
}
