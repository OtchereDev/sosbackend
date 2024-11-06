import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GuideService } from './guide.service';
import { CreateCategory } from './dto/CreateCategory.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateGuide } from './dto/CreateGuide.dto';

@Controller('guide')
@ApiTags('Guide')
export class GuideController {
  constructor(private service: GuideService) {}

  @Get('/')
  async getAllGuides() {
    return await this.service.getAllGuides();
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
  async createGuide(@Body() body: CreateGuide) {
    return await this.service.createGuide(body);
  }

  @Get('/:id')
  async getGuide(@Param('id') id: string) {
    return await this.service.getGuide(id);
  }
}
