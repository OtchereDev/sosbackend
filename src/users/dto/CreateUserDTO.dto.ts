import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreateEmergencyContact {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;
}

export class CreateUserDTO {
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

  @IsNotEmpty()
  @Type(() => CreateEmergencyContact)
  @ValidateNested()
  @ApiProperty({ type: CreateEmergencyContact })
  emergencyContact: CreateEmergencyContact;
}

export class UpdateUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;
}
