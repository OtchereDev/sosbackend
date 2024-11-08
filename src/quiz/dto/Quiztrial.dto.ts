import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsMongoId,
  IsUppercase,
  Length,
  ValidateNested,
} from 'class-validator';

class QuizTrialAnswer {
  @IsMongoId()
  @ApiProperty()
  question_id: string;

  @IsAlpha()
  @IsUppercase()
  @Length(1, 1)
  @ApiProperty()
  answer: string;
}

export class QuizTrial {
  @ValidateNested()
  @Type(() => QuizTrialAnswer)
  @ApiProperty({ type: [QuizTrialAnswer] })
  answers: QuizTrialAnswer[];

  @IsMongoId()
  quiz_id: string;
}
