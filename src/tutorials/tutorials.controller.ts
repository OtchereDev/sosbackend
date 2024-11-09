import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDTO } from './dto/Tutorials.dto';

@Controller('tutorials')
@ApiTags('Tutorials')
export class TutorialsController {
  constructor(private service: TutorialsService) {}

  @Get('/')
  async getAllTutorials() {
    const response = await this.service.getAllTutorials();

    return response;
  }

  @Get('/:id')
  async getTutorial(@Param('id') id: string) {
    const response = await this.service.getATutorial(id);

    return response;
  }

  @Post('/')
  async createTutorial(@Body() body: CreateTutorialDTO) {
    const response = await this.service.createTutorial(body);

    return response;
  }
}
