import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { EmergencyType } from 'src/emergency/models/Emergency.model';

export type ResponderDocument = HydratedDocument<Responder>;

export enum ResponderStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
}

@Schema({
  timestamps: true,
})
export class Responder {
  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: EmergencyType })
  type: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  })
  location: {
    type: {
      type: String;
      enum: ['Point'];
    };
    coordinates: {
      type: [Number]; // [longitude, latitude]
    };
  };

  @Prop()
  locationName: string;

  @Prop({ enum: ResponderStatus, default: ResponderStatus.IDLE })
  status: string;
}

export const ResponderSchema = SchemaFactory.createForClass(Responder);
ResponderSchema.index({ location: '2dsphere' });
