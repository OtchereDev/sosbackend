import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './models/chat.model';
import { Model } from 'mongoose';
import { ChatMessage, ChatUser } from './models/message.model';
import { AiService } from 'src/ai/ai.service';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(ChatMessage.name) private chatMessage: Model<ChatMessage>,
    private aiService: AiService,
  ) {}

  async createNewChat(user: string) {
    const message = await this.chatMessage.create({
      role: ChatUser.System,
      content:
        'You are a first responder to people in emergency. You can be a Police, Ambulance or Fire service attendant',
      user,
    });

    const chat = await this.chatModel.create({
      user,
      messages: [message._id],
    });

    return {
      status: 200,
      message: 'successfully created chat',
      chat,
    };
  }

  async allChat(id: string) {
    const chats = await this.chatModel.find({
      user: id,
    });

    return {
      status: 200,
      chats,
    };
  }

  async chatDetails(userId: string, chatId: string) {
    const chat = await this.chatModel.findOne(
      {
        user: userId,
        _id: chatId,
      },
      undefined,
      {
        populate: ['messages'],
      },
    );

    return {
      status: 200,
      chat,
    };
  }

  async addMessage(content: string, chatId: string, userId: string) {
    const chat = await this.chatModel.findOne(
      {
        id: chatId,
        user: userId,
      },
      undefined,
      { populate: ['messages'] },
    );

    const messages = (chat?.messages ?? [])?.map((message) => [
      message.role as ChatUser,
      message.content,
    ]);

    messages.push([ChatUser.Human, content]);

    try {
      const completion = await this.aiService.completionsLLM(
        messages as BaseLanguageModelInput,
      );

      const chatMessage = await this.chatMessage.create([
        {
          user: userId,
          content,
          role: ChatUser.Human,
        },
        {
          user: userId,
          content: completion.response,
          role: ChatUser.Assistant,
        },
      ]);

      await this.chatModel.updateOne(
        {
          _id: chatId,
        },
        {
          $push: chatMessage.map((c) => c._id),
        },
      );

      return {
        status: 200,
        data: {
          response: completion.response,
        },
      };
    } catch (error) {
      return {
        status: 200,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  async chooseService(content: string) {
    const response = await this.aiService.chooseService(content);

    return response;
  }
}
