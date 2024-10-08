import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/User.model';
import {
  EmergencyContact,
  EmergencyContactSchema,
} from './models/EmergencyContact.model';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from './models/ForgotPassword.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmergencyContact.name, schema: EmergencyContactSchema },
      { name: ForgotPassword.name, schema: ForgotPasswordSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
