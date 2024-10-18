import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/models/User.model';
import * as mongoose from 'mongoose';
import { Location } from './Location.model';

export type EmergencyDocument = HydratedDocument<Emergency>;

export enum EmergencyStatus {
  RESOLVED = 'RESOLVED',
  UNRESOLVED = 'UNRESOLVED',
  DISMISSED = 'DISMISSED',
  CANCELLED = 'CANCELLED',
}

export enum EmergencyType {
  POLICE = 'POLICE',
  FIRE = 'FIRE',
  AMBULANCE = 'AMBULANCE',
}

export enum EmergencySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema({
  timestamps: true,
})
export class Emergency {
  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: User;

  @Prop()
  description: string;

  @Prop()
  summary: string;

  @Prop({ enum: EmergencyStatus, default: EmergencyStatus.UNRESOLVED })
  status: EmergencyStatus;

  @Prop({ enum: EmergencyType })
  emergencyType: EmergencyType;

  @Prop({ enum: EmergencySeverity })
  severity: EmergencySeverity;

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({ type: [String] })
  photos: string[];
}

export const EmergencySchema = SchemaFactory.createForClass(Emergency);
