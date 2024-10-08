import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDTO } from './dto/ForgotPasswordDTO.dto';
import { ResetPasswordDTO } from './dto/ResetPasswordDTO.dto';

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
}
