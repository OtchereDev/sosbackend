import { Injectable } from '@nestjs/common';
import { Bedrock } from '@langchain/community/llms/bedrock';
import { BedrockChat } from '@langchain/community/chat_models/bedrock';

import {
  BedrockClient,
  ListFoundationModelsCommand,
} from '@aws-sdk/client-bedrock';

@Injectable()
export class AiService {
  private llm: Bedrock;
  private chatter: BedrockChat;
  constructor() {
    this.llm = new Bedrock({
      model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
      },
      temperature: 0,
      maxTokens: undefined,
    });

    this.chatter = new BedrockChat({
      model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
      },
    });
  }

  async testLLM() {
    const aiMsg = await this.chatter.invoke([
      [
        'system',
        'You are a helpful assistant that translates English to French. Translate the user sentence.',
      ],
      ['human', 'I love programming.'],
    ]);

    return {
      aiMsg,
    };
  }
}
