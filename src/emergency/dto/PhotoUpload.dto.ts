import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBase64, IsNotEmpty } from 'class-validator';

export class PhotoUploadDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty()
  photos: string[];
}
