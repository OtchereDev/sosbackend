import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './User.model';
import * as mongoose from 'mongoose';

export type EmergencyContactDocument = HydratedDocument<EmergencyContact>;

@Schema({
  timestamps: true,
})
export class EmergencyContact {
  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: User;
}

export const EmergencyContactSchema =
  SchemaFactory.createForClass(EmergencyContact);
