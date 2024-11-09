import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tutorial } from './models/tutorial.models';
import { Model } from 'mongoose';
import { CreateTutorialDTO } from './dto/Tutorials.dto';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectModel(Tutorial.name) private tutorialModel: Model<Tutorial>,
  ) {}

  async getAllTutorials() {
    const tutorials = await this.tutorialModel.find({}, { videos: 0 });

    return {
      status: 200,
      data: {
        tutorials,
      },
    };
  }

  async getATutorial(id: string) {
    const tutorial = await this.tutorialModel.findById(id);

    return {
      status: 200,
      data: {
        tutorial,
      },
    };
  }

  async createTutorial(data: CreateTutorialDTO) {
    await this.tutorialModel.create(data);

    return {
      status: 200,
      message: 'Tutorial successfully created',
    };
  }
}
