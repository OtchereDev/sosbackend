import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTokenDTO {
  @IsNotEmpty()
  @ApiProperty()
  channelName: string;
}
