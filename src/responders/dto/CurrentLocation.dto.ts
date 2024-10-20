import { ApiProperty } from '@nestjs/swagger';
import { IsLatLong, IsMongoId, IsNotEmpty } from 'class-validator';

export class CurrentLocationDTO {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @IsLatLong()
  @ApiProperty()
  location: string;

  @IsNotEmpty()
  @ApiProperty()
  locationName: string;

  @ApiProperty()
  @IsNotEmpty()
  apiId: string;
}
