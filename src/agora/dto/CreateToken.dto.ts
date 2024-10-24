import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

enum TokenRole {
  publisher = 'publisher',
  audience = 'audience',
}

export class CreateTokenDTO {
  @IsNotEmpty()
  @ApiProperty()
  channelName: string;

  @IsEnum(TokenRole)
  role: string;
}
