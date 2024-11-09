import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateTutorialDTO {
  @IsNotEmpty()
  title: string;

  @IsArray()
  videos: string[];
}
