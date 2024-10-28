import { Injectable } from '@nestjs/common';
import {
  CreateEmergencyContact,
  CreateUserDTO,
  UpdateUserDTO,
} from './dto/CreateUserDTO.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/User.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { EmergencyContact } from './models/EmergencyContact.model';
import otp from 'src/utils/otps';
import { ForgotPassword } from './models/ForgotPassword.model';
import { ResetPasswordDTO } from './dto/ResetPasswordDTO.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(EmergencyContact.name)
    private emergencyModel: Model<EmergencyContact>,
    @InjectModel(ForgotPassword.name)
    private forgotPasswordModel: Model<ForgotPassword>,
  ) {}

  async createUser(body: CreateUserDTO) {
    try {
      const exist = await this.userExists(body.email);

      if (exist) {
        return {
          status: 400,
          message: 'User with this email already exists',
        };
      }

      const user = await this.userModel.create({
        email: body.email,
        name: body.name,
        password: this.hashPassword(body.password),
        phoneNumber: body.phoneNumber,
      });

      await this.emergencyModel.create({
        name: body.emergencyContact.name,
        email: body.emergencyContact.email,
        phoneNumber: body.emergencyContact.phoneNumber,
        user,
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

  async findOne(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email });
  }

  async userExists(email: string) {
    return await this.userModel.exists({
      email,
    });
  }

  async requestForgotPassword(email: string) {
    const exists = await this.findOne(email);
    const response = {
      status: 200,
      message: 'A reset link has been sent to your email',
    };

    if (!exists) {
      return response;
    }

    let newLink: string;

    while (true) {
      newLink = otp(20, { specialChars: false });

      const linkExists = await this.forgotPasswordModel.exists({
        resetToken: newLink,
      });

      if (!linkExists) {
        break;
      }
    }

    await this.forgotPasswordModel.create({
      resetToken: newLink,
      email,
      user: exists,
    });

    // TODO: send email to user

    return { ...response, newLink, userId: (exists as any)._id };
  }

  async resetPassword(body: ResetPasswordDTO) {
    const reset = await this.forgotPasswordModel.findOne({
      user: body.userId,
      resetToken: body.resetToken,
    });

    if (!reset || reset.isUsed) {
      return {
        status: 400,
        message:
          'Reset link has expired or has been used. Please generate a new link.',
      };
    }

    const user = await this.userModel.findById(reset.user);

    await this.userModel.updateOne(
      {
        email: user.email,
      },
      {
        password: this.hashPassword(body.password),
      },
    );

    await this.forgotPasswordModel.updateOne(
      {
        user: body.userId,
        resetToken: body.resetToken,
      },
      {
        isUsed: true,
      },
    );

    return {
      status: 200,
      message: 'Password has been updated successfully',
    };
  }

  async getEmergencyContact(userId: string) {
    return await this.emergencyModel.findOne({ user: userId });
  }

  async getProfile(email: string) {
    const user: any = await this.findOne(email);

    const { password, ...result } = user._doc;

    return {
      status: 200,
      data: result,
    };
  }

  async updateProfile(body: UpdateUserDTO, email: string) {
    const user = await this.userModel.findOne({ email });

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        name: body.name,
        phoneNumber: body.phoneNumber,
      },
    );

    return {
      status: 200,
      message: 'Successfully updated profile',
    };
  }

  async updateEmergencyContact(body: CreateEmergencyContact, email: string) {
    const user = await this.userModel.findOne({ email });

    await this.emergencyModel.updateOne(
      {
        user: user._id,
      },
      {
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
      },
    );

    return {
      status: 200,
      message: 'Successfully updated emergency contact',
    };
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);

    return {
      status: 200,
      user,
    };
  }
}
