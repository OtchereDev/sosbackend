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
import {
  CreateEmergencyContact,
  CreateUserDTO,
  UpdateUserDTO,
} from './dto/CreateUserDTO.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDTO } from './dto/ForgotPasswordDTO.dto';
import { ResetPasswordDTO } from './dto/ResetPasswordDTO.dto';
import { AuthGuard, ResponderAuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('create')
  @ApiBody({ type: CreateUserDTO })
  async createAccount(@Body() body: CreateUserDTO, @Res() res: Response) {
    const response = await this.service.createUser(body);

    return res.status(response.status).json(response);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDTO })
  async requestForgotPassword(
    @Body() body: ForgotPasswordDTO,
    @Res() res: Response,
  ) {
    const response = await this.service.requestForgotPassword(body.email);

    return res.status(response.status).json(response);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDTO })
  async resetPassword(@Body() body: ResetPasswordDTO, @Res() res: Response) {
    const response = await this.service.resetPassword(body);
    return res.status(response.status).json(response);
  }

  @Get('my-profile')
  @UseGuards(AuthGuard)
  async getProfile(@Res() res: Response, @Req() req: any) {
    const email = req.user.email;
    const response = await this.service.getProfile(email);

    return res.status(response.status).json(response);
  }

  @Get('responder/:id')
  @UseGuards(ResponderAuthGuard)
  async getProfileResponder(@Param('id') id: string, @Res() res: Response) {
    const response = await this.service.getUserById(id);

    return res.status(response.status).json(response);
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Body() body: UpdateUserDTO,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const email = req.user.email;
    const response = await this.service.updateProfile(body, email);

    return res.status(response.status).json(response);
  }

  @Patch('update-emergency-contact')
  @UseGuards(AuthGuard)
  async updateEmergencyContact(
    @Body() body: CreateEmergencyContact,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const email = req.user.email;

    const response = await this.service.updateEmergencyContact(body, email);

    return res.status(response.status).json(response);
  }

  @Get('get-emergency-contact')
  @UseGuards(AuthGuard)
  async getEmergencyContact(@Res() res: Response, @Req() req: any) {
    const id = req.user.sub;

    const response = await this.service.getEmergencyContact(id);

    return res.json(response);
  }
}
