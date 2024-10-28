import { Bedrock } from '@langchain/community/llms/bedrock';

const llm = new Bedrock({
  model: 'anthropic.claude-v2',
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
  },
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
});
