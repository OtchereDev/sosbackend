import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RespondersService } from './responders.service';
import { CurrentLocationDTO } from './dto/CurrentLocation.dto';
import { Response } from 'express';
import { ResponderAuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateResponderDTO } from './dto/CreateResponder.dto';

@Controller('responders')
@ApiTags('Responder')
export class RespondersController {
  constructor(private service: RespondersService) {}

  @Post('set-current-location')
  async setCurrentLocation(
    @Body() body: CurrentLocationDTO,
    @Res() res: Response,
  ) {
    if (body.apiId !== process.env.APP_ID) {
      throw new UnauthorizedException();
    }

    const response = await this.service.setCurrentLocation(body);

    return res.status(response.status).json(response);
  }

  @Get('my-profile')
  @UseGuards(ResponderAuthGuard)
  async getProfile(@Res() res: Response, @Req() req: any) {
    const email = req.user.email;
    const response = await this.service.getProfile(email);

    return res.status(response.status).json(response);
  }

  @Post('create')
  @ApiBody({ type: CreateResponderDTO })
  async createResponder(
    @Body() body: CreateResponderDTO,
    @Res() res: Response,
  ) {
    const response = await this.service.createUser(body);

    return res.status(response.status).json(response);
  }
}
