import { Type } from 'class-transformer';
import { IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';

class QuizAnswer {
  @IsNotEmpty()
  answer: string;

  @IsNotEmpty()
  symbol: string;
}

class QuizQuestion {
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  correctAnswer: string;

  @ValidateNested()
  @Type(() => QuizAnswer)
  options: QuizAnswer[];
}

export class CreateQuiz {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsUrl()
  image: string;

  @ValidateNested()
  @Type(() => QuizQuestion)
  questions: QuizQuestion[];
}
