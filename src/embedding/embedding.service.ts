import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI();
  }

  async getTextEmbedding(text: string) {
    const embedding = await this.client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
      encoding_format: 'float',
    });

    return embedding.data[0].embedding;
  }
}
