import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, Matches } from 'class-validator';

export class ResetPasswordDTO {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @ApiProperty()
  resetToken: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  @ApiProperty()
  password: string;
}
