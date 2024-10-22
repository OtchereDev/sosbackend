import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AuthGuard, ResponderAuthGuard } from 'src/auth/auth.guard';
import { CreateTokenDTO } from './dto/CreateToken.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('agora')
@ApiTags('Agora')
export class AgoraController {
  constructor(private service: AgoraService) {}

  @Post('tokens')
  @UseGuards(AuthGuard)
  generateToken(@Body() body: CreateTokenDTO, @Req() req: any) {
    const userId = req.user.sub;
    return this.service.generateRTCToken(userId, body.channelName);
  }

  @Post('tokens/responder')
  @UseGuards(ResponderAuthGuard)
  async generateResponderToken(@Body() body: CreateTokenDTO, @Req() req: any) {
    const userId = req.user.sub;
    return this.service.generateRTCToken(userId, body.channelName);
  }
}
