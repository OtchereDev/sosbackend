import { ApiProperty } from '@nestjs/swagger';
import { IsLatLong } from 'class-validator';

export class ResponderDashboardDTO {
  @IsLatLong()
  @ApiProperty()
  location: string;
}
