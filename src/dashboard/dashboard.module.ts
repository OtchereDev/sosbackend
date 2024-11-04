import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Emergency,
  EmergencySchema,
} from 'src/emergency/models/Emergency.model';
import {
  Responder,
  ResponderSchema,
} from 'src/responders/models/Responder.models';
import {
  ResponderMetrics,
  ResponderMetricSchema,
} from 'src/responders/models/Metric.models';

@Module({
  providers: [DashboardService],
  controllers: [DashboardController],
  imports: [
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
      { name: Responder.name, schema: ResponderSchema },
      { name: ResponderMetrics.name, schema: ResponderMetricSchema },
    ]),
  ],
})
export class DashboardModule {}
