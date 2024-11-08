import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuizQuestion } from './quiz-question.models';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({
  timestamps: true,
})
export class Quiz {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [QuizQuestion] })
  questions: QuizQuestion[];

  @Prop()
  image: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
