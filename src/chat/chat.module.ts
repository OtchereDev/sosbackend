import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './models/chat.model';
import { ChatMessage, ChatMessageSchema } from './models/message.model';
import { AiModule } from 'src/ai/ai.module';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatService],
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
    ]),
    AiModule,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
