import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsMongoId()
  @ApiProperty()
  chatId: string;
}
