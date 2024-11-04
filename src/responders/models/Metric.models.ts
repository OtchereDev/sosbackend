import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { EmergencyType } from 'src/emergency/models/Emergency.model';
import { Responder } from './Responder.models';

export type ResponderMetricDocument = HydratedDocument<ResponderMetrics>;

@Schema({
  timestamps: true,
})
export class ResponderMetrics {
  @Prop({ default: 0 })
  numberOfEmergency: number;

  @Prop({ default: 0 })
  accumulatedResponseTime: number;

  @Prop({ default: 0 })
  accumulatedOnSceneTime: number;

  @Prop({ default: 0 })
  accumulatedTurnaroundTime: number;

  @Prop({ default: 0 })
  numberOfArrest: number;

  @Prop({ default: 0 })
  numberOfEscape: number;

  @Prop({ default: 0 })
  numberOfFirePutOut: number;

  @Prop({ default: 0 })
  numberOfFireNotPutOut: number;

  @Prop({ default: 0 })
  numberOfLiveSaved: number;

  @Prop({ default: 0 })
  numberOfDeath: number;

  @Prop({ ref: 'Responder', type: mongoose.Schema.Types.ObjectId })
  responder: Responder;
}

export const ResponderMetricSchema =
  SchemaFactory.createForClass(ResponderMetrics);
