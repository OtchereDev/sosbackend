import { Injectable } from '@nestjs/common';
import { Bedrock } from '@langchain/community/llms/bedrock';
import { BedrockChat } from '@langchain/community/chat_models/bedrock';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';

@Injectable()
export class AiService {
  private chatter: BedrockChat;
  constructor() {
    this.chatter = new BedrockChat({
      model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
      },
    });
  }

  async completionsLLM(chat: BaseLanguageModelInput) {
    const aiMsg = await this.chatter.invoke(chat);

    return {
      response: aiMsg.content,
    };
  }

  async chooseService(message: string) {
    // Constructing a prompt that instructs the AI to choose the best option
    const optionsText = ['POLICE', 'AMBULANCE', 'FIRE'].join(', ');
    const levelOptions = ['LOW', 'MEDIUM', 'HIGH'].join(', ');
    const messages = [
      [
        'system',
        `Given a context, which service is most appropriate from the options: ${optionsText} and which severity level is most appropriate from the options: ${levelOptions}? Please respond with the service name and severity level only comma seperated.`,
      ],
      ['user', message],
    ] as BaseLanguageModelInput;

    const aiMsg = await this.chatter.invoke(messages);

    return {
      selectedService: aiMsg.content as string,
    };
  }
}
