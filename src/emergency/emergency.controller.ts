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
import { AuthGuard, ResponderAuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SmartApplyDTO } from './dto/SmartApply.dto';

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

  @Post('/create/smart')
  @UseGuards(AuthGuard)
  async createSmartEmergency(
    @Body() body: SmartApplyDTO,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const email = req.user.email;
    const response = await this.service.smartApply(body, email);

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

  @Patch('accept-emergency/:id')
  @UseGuards(ResponderAuthGuard)
  async acceptEmergency(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const response = await this.service.acceptEmergency({
      emergencyId: id,
      responderId: req.user.sub,
    });

    return res.status(response.status).json(response);
  }

  @Patch('complete-emergency/:id')
  @UseGuards(ResponderAuthGuard)
  async completeEmergency(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const response = await this.service.completeEmergency({
      emergencyId: id,
      responderId: req.user.sub,
    });

    return res.status(response.status).json(response);
  }

  @Patch('retry-emergency/:id')
  @UseGuards(AuthGuard)
  async retryEmergency(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const response = await this.service.retryEmergency({
      emergencyId: id,
      userId: req.user.sub,
    });

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

  @Get('responder/:id')
  @UseGuards(ResponderAuthGuard)
  async getEmergencyResponder(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const response = await this.service.geEmergencyResponder(id);

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

  @Post('/:id/responder-arrived')
  @UseGuards(ResponderAuthGuard)
  async arriveAtEmergency(
    @Res() res: Response,
    @Req() req: any,
    @Param('id') emergencyId: string,
  ) {
    const responder = req.user.sub;
    const response = await this.service.arriveAtEmergency(
      emergencyId,
      responder,
    );

    return res.status(response.status).json(response);
  }
}
