import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Emergency, EmergencySchema } from './models/Emergency.model';
import { User, UserSchema } from 'src/users/models/User.model';
import { RespondersModule } from 'src/responders/responders.module';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  providers: [EmergencyService],
  controllers: [EmergencyController],
  imports: [
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
      { name: User.name, schema: UserSchema },
    ]),
    RespondersModule,
    EmbeddingModule,
    AiModule,
  ],
})
export class EmergencyModule {}
