import { Module } from '@nestjs/common';
import { GuideService } from './guide.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmergencyGuide,
  EmergencyGuideSchema,
} from './models/EmergencyGuide.models';
import { GuideController } from './guide.controller';
import { Category, CategorySchema } from './models/Category.models';

@Module({
  providers: [GuideService],
  imports: [
    MongooseModule.forFeature([
      { name: EmergencyGuide.name, schema: EmergencyGuideSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [GuideController],
})
export class GuideModule {}
