import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Model configurations
const createModel = (config: {
    provider: 'deepseek' | 'openrouter';
    modelName: string;
    apiKey: string;
    baseURL: string;
}) => new ChatOpenAI({
    openAIApiKey: config.apiKey,
    modelName: config.modelName,
    temperature: 0.3,
    maxTokens: 500,
    configuration: {
        baseURL: config.baseURL,
    },
});

// Initialize models
export const models = {
    deepseek: createModel({
        provider: 'deepseek',
        modelName: 'deepseek-chat',
        apiKey: process.env.DEEPSEEK_API_KEY!,
        baseURL: 'https://api.deepseek.com/v1',
    }),

    gpt4oMini: createModel({
        provider: 'openrouter',
        modelName: 'openai/gpt-4o-mini',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    sonar: createModel({
        provider: 'openrouter',
        modelName: 'perplexity/sonar-small-chat',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    gemini: new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
        modelName: 'gemini-2.0-flash-lite-preview-02-05',
    }),
};
