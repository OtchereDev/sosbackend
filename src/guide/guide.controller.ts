import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateCategory } from './dto/CreateCategory.dto';

@Controller('guide')
export class GuideController {
  constructor(private service: GuideService) {}

  @Get('/')
  async getAllGuides() {
    return await this.service.getAllGuides();
  }

  @Get('/:id')
  async getGuide(@Param('id') id: string) {
    return await this.service.getGuide(id);
  }

  @Get('/categories')
  async getAllCategories() {
    return await this.service.getAllCategory();
  }

  @Post('/categories')
  async createCategory(@Body() body: CreateCategory) {
    return await this.service.createCategory(body.name);
  }

  @Post('/')
  async createGuide() {}
}
