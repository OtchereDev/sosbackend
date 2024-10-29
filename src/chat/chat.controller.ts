import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SendMessageDTO } from './dto/SendMessage.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('Chat')
export class ChatController {
  constructor(private service: ChatService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  async createNewChat(@Req() req: any) {
    const user = req.user.sub;

    const response = await this.service.createNewChat(user);

    return response;
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getAllChat(@Req() req: any) {
    const user = req.user.sub;

    const response = await this.service.allChat(user);

    return response;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getChatDetail(@Req() req: any, @Param('id') id: string) {
    const user = req.user.sub;

    const response = await this.service.chatDetails(user, id);

    return response;
  }

  @Post('/message')
  @UseGuards(AuthGuard)
  async sendMessage(@Req() req: any, @Body() body: SendMessageDTO) {
    const user = req.user.sub;

    const response = await this.service.addMessage(
      body.content,
      body.chatId,
      user,
    );

    return response;
  }
}
