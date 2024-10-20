import { Module } from '@nestjs/common';
import { RespondersService } from './responders.service';
import { RespondersController } from './responders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Responder, ResponderSchema } from './models/Responder.models';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [RespondersService],
  controllers: [RespondersController],
  imports: [
    MongooseModule.forFeature([
      { name: Responder.name, schema: ResponderSchema },
    ]),
    FirebaseModule,
  ],
  exports: [RespondersService],
})
export class RespondersModule {}
