import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuizAnswer } from './quiz-answer.models';

export type QuizQuestionDocument = HydratedDocument<QuizQuestion>;

@Schema({
  timestamps: true,
})
export class QuizQuestion {
  @Prop()
  question: string;

  @Prop({ type: [QuizAnswer] })
  options: QuizAnswer[];

  @Prop()
  correctAnswer: string;
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);
