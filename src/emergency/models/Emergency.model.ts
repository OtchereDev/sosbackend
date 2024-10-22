import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/models/User.model';
import * as mongoose from 'mongoose';
import { Responder } from 'src/responders/models/Responder.models';

export type EmergencyDocument = HydratedDocument<Emergency>;

export enum EmergencyStatus {
  RESOLVED = 'RESOLVED',
  UNRESOLVED = 'UNRESOLVED',
  INPROGRESS = 'INPROGRESS',
  ARRIVED = 'ARRIVED',
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

export type ILocation = {
  type: string;
  coordinates: [number, number];
};

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

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: {
      type: String;
      enum: ['Point'];
      required: true;
    };
    coordinates: {
      type: [Number];
      required: true;
    };
  };

  @Prop()
  locationName: string;

  @Prop({ type: [String] })
  photos: string[];

  @Prop({ ref: 'Responder', type: mongoose.Schema.Types.ObjectId })
  responder: Responder;
}

export const EmergencySchema = SchemaFactory.createForClass(Emergency);

EmergencySchema.index({ location: '2dsphere' });
