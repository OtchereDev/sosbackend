import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { PhotoUploadDTO } from './dto/PhotoUpload.dto';
import { Response } from 'express';
import { CreateEmergencyDTO } from './dto/CreateEmergency.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('emergency')
@ApiTags('Emergency')
export class EmergencyController {
  constructor(private service: EmergencyService) {}

  @Post('/upload-photos')
  async uploadPhotos(@Body() body: PhotoUploadDTO, @Res() res: Response) {
    const response = await this.service.uploadPhoto(body.photos);

    return res.status(200).json({
      status: 200,
      data: {
        urls: response,
      },
    });
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  async createEmergency(
    @Body() body: CreateEmergencyDTO,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const email = req.user.email;
    const response = await this.service.createEmergency(body, email);

    return res.status(response.status).json(response);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getMyEmergencies(@Res() res: Response, @Req() req: any) {
    const email = req.user.email;
    const response = await this.service.getMyEmergency(email);

    return res.status(response.status).json(response);
  }

  @Get('/all')
  async getAllEmergencies(@Res() res: Response) {
    const response = await this.service.getAllEmergency();

    return res.status(response.status).json(response);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async cancelEmergency(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const email = req.user.email;
    const response = await this.service.cancelEmergency(id, email);

    return res.status(response.status).json(response);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getEmergency(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const email = req.user.email;
    const response = await this.service.getEmergency(id, email);

    return res.status(response.status).json(response);
  }
}
