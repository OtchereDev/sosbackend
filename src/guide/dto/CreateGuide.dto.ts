import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateGuide {
  @IsMongoId()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsUrl()
  @ApiProperty()
  image: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  video: string;
}
