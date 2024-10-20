import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  Matches,
  IsEnum,
} from 'class-validator';
import { EmergencyType } from 'src/emergency/models/Emergency.model';

export class CreateResponderDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  @ApiProperty()
  password: string;

  @IsEnum(EmergencyType)
  type: string;
}
