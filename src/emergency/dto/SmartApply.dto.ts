import { IsLatLong, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmartApplyDTO {
  @IsLatLong()
  @ApiProperty()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  locationName: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
