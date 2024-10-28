import { Injectable } from '@nestjs/common';
import { Bedrock } from '@langchain/community/llms/bedrock';
import {
  BedrockClient,
  ListFoundationModelsCommand,
} from '@aws-sdk/client-bedrock';

@Injectable()
export class AiService {
  private llm: Bedrock;
  private client: BedrockClient;
  constructor() {
    this.llm = new Bedrock({
      model: 'mistral.mistral-7b-instruct-v0:2',
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
      },
      temperature: 0,
      maxTokens: undefined,
    });
    this.client = new BedrockClient({ region: process.env.AWS_REGION });
  }

  async testLLM() {
    try {
      const command = new ListFoundationModelsCommand({});
      const response = await this.client.send(command);

      console.log('Available Models:', response);
    } catch (err) {
      console.error('Error fetching models:', err);
    }

    const inputText = 'Human: Bedrock is an AI company that\nAssistant: ';
    const completion = await this.llm.invoke(inputText);

    return {
      completion,
    };
  }
}
