import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TutorialDocument = HydratedDocument<Tutorial>;

@Schema({
  timestamps: true,
})
export class Tutorial {
  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop({ type: [String] })
  videos: string[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);
