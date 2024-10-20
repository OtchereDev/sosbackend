import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsLatLong,
  IsNotEmpty,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { EmergencySeverity, EmergencyType } from '../models/Emergency.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmergencyDTO {
  @IsLatLong()
  @ApiProperty()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  locationName: string;

  @IsEnum(EmergencyType)
  @ApiProperty()
  emergencyType: string;

  @IsEnum(EmergencySeverity)
  @ApiProperty()
  severity: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @ValidateIf((_, v) => v?.length > 0)
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  @ApiProperty()
  photos: string[];
}
