import { Module } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { TutorialsController } from './tutorials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tutorial, TutorialSchema } from './models/tutorial.models';

@Module({
  providers: [TutorialsService],
  controllers: [TutorialsController],
  imports: [
    MongooseModule.forFeature([
      { name: Tutorial.name, schema: TutorialSchema },
    ]),
  ],
})
export class TutorialsModule {}
