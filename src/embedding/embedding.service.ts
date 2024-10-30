import { Injectable } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingService {
  constructor() {}

  async getTextEmbedding(text: string) {
    const embedder = await pipeline(
      'feature-extraction',
      'Xenova/nomic-embed-text-v1',
    );
    const results = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(results.data);
  }
}
