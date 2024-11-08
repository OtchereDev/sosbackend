import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizAnswerDocument = HydratedDocument<QuizAnswer>;

@Schema({
  timestamps: true,
})
export class QuizAnswer {
  @Prop()
  answer: string;

  @Prop()
  symbol: string; //either A, B, C ...
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);
