import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  constructor() {}

  async getTextEmbedding(text: string) {
    const transformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await transformersApi;
    const embedder = await pipeline(
      'feature-extraction',
      'Xenova/nomic-embed-text-v1',
    );
    const results = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(results.data);
  }
}
