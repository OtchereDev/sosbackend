import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './models/quiz.models';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from './models/quiz-question.models';
import { QuizAnswer, QuizAnswerSchema } from './models/quiz-answer.models';
import { QuizService } from './quiz.service';

@Module({
  controllers: [QuizController],
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: QuizQuestion.name, schema: QuizQuestionSchema },
      { name: QuizAnswer.name, schema: QuizAnswerSchema },
    ]),
  ],
  providers: [QuizService],
})
export class QuizModule {}
