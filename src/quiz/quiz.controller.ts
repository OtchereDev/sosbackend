import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuiz } from './dto/CreateQuiz.dto';
import { Response } from 'express';
import { QuizTrial } from './dto/Quiztrial.dto';
import { ResponderAuthGuard } from 'src/auth/auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private service: QuizService) {}

  @Post('/')
  async createQuiz(@Body() body: CreateQuiz, @Res() res: Response) {
    const response = await this.service.createQuiz(body);

    return res.status(response.status).json(response);
  }

  @Get('/')
  async getAllQuizes() {
    const response = await this.service.getAllQuiz();

    return response;
  }

  @Post('/solve')
  // @UseGuards(ResponderAuthGuard)
  async answerQuiz(@Body() body: QuizTrial, @Res() res: Response) {
    const response = await this.service.solveQuiz(body);

    return res.status(response.status).json(response);
  }

  @Get('/:id')
  async getQuiz(@Param('id') id: string) {
    const response = await this.service.getAQuiz(id);

    return response;
  }
}
