import { Prop } from '@nestjs/mongoose';

export class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}
