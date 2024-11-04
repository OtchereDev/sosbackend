import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emergency, EmergencyType } from 'src/emergency/models/Emergency.model';
import { ResponderMetrics } from 'src/responders/models/Metric.models';
import { Responder } from 'src/responders/models/Responder.models';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(Responder.name) private responderModel: Model<Responder>,
    @InjectModel(ResponderMetrics.name)
    private metricModel: Model<ResponderMetrics>,
  ) {}

  async getResponderDashboard(
    userCoordinates: [number, number],
    responderId: string,
  ) {
    const responder = await this.responderModel.findById(responderId);
    const currentEmergencies = await this.getCurrentEmergency(userCoordinates);
    const metric = await this.getOrCreateEmergency(responderId);

    const averageResponseTime = (
      metric.accumulatedResponseTime / metric.numberOfEmergency
    ).toFixed(2);
    const averageOnSceneTime = (
      metric.accumulatedOnSceneTime / metric.numberOfEmergency
    ).toFixed(2);
    const averageTurnaroundTime = (
      metric.accumulatedTurnaroundTime / metric.numberOfEmergency
    ).toFixed(2);

    let metrics: any = {
      averageResponseTime,
      averageOnSceneTime,
      averageTurnaroundTime,
    };

    if (responder.type === EmergencyType.AMBULANCE) {
      metrics = {
        ...metrics,
        numberOfLiveSaved: metric.numberOfLiveSaved,
        numberOfDeath: metric.numberOfDeath,
      };
    } else if (responder.type === EmergencyType.POLICE) {
      metrics = {
        ...metrics,
        numberOfArrest: metric.numberOfArrest,
        numberOfEscape: metric.numberOfEscape,
      };
    } else {
      metrics = {
        ...metrics,
        numberOfFirePutOut: metric.numberOfFirePutOut,
        numberOfFireNotPutOut: metric.numberOfFireNotPutOut,
      };
    }

    return {
      status: 200,
      data: {
        currentEmergencies,
        metric,
      },
    };
  }

  async getCurrentEmergency(userCoordinates: [number, number]) {
    const closestEmergencies = await this.emergencyModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: userCoordinates,
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      { $sort: { distance: 1, createdAt: -1 } },
      { $limit: 5 },
      {
        $project: {
          user: 1,
          description: 1,
          summary: 1,
          emergencyType: 1,
          severity: 1,
          location: 1,
          locationName: 1,
          distance: 1,
          createdAt: 1,
        },
      },
    ]);

    return closestEmergencies;
  }

  async getOrCreateEmergency(responderId: string) {
    let metric = await this.metricModel.findOne({
      responder: responderId,
    });

    if (!metric) {
      metric = await this.metricModel.create({
        responder: responderId,
      });
    }

    return metric;
  }
}
