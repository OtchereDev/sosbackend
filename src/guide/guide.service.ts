import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmergencyGuide } from './models/EmergencyGuide.models';
import { Category } from './models/Category.models';

@Injectable()
export class GuideService {
  constructor(
    @InjectModel(EmergencyGuide.name) private guideModel: Model<EmergencyGuide>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getAllGuides() {
    const guides = await this.guideModel.find({}, undefined, {
      populate: ['category'],
    });

    return {
      status: 200,
      data: {
        guides,
      },
    };
  }

  async getGuide(id: string) {
    const guide = await this.guideModel.findById(id, undefined, {
      populate: ['category'],
    });

    return {
      status: 200,
      data: {
        guide,
      },
    };
  }

  async getAllCategory() {
    const categories = await this.categoryModel.find({});

    return {
      status: 200,
      data: {
        categories,
      },
    };
  }

  async createCategory(name: string) {
    await this.categoryModel.create({
      name,
    });

    return {
      status: 200,
      message: 'Category successfully created',
    };
  }
}
