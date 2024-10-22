import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from './Category.models';

export type EmergencyGuideDocument = HydratedDocument<EmergencyGuide>;

@Schema({
  timestamps: true,
})
export class EmergencyGuide {
  @Prop()
  title: string;

  @Prop({ ref: 'Category', type: mongoose.Schema.Types.ObjectId })
  category: Category;

  @Prop()
  image: string;

  @Prop()
  video: string;

  @Prop()
  content: string;
}

export const EmergencyGuideSchema =
  SchemaFactory.createForClass(EmergencyGuide);
