import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Add OpenRouter specific configuration types
type OpenRouterConfig = {
    order?: string[];
    allow_fallbacks?: boolean;
    require_parameters?: boolean;
    data_collection?: 'allow' | 'deny';
    ignore?: string[];
    quantizations?: string[];
    sort?: 'price' | 'throughput';
};

// Model configurations
const createModel = (config: {
    provider: 'deepseek' | 'openrouter';
    modelName: string;
    apiKey: string;
    baseURL: string;
    openRouterConfig?: OpenRouterConfig;
}) => new ChatOpenAI({
    openAIApiKey: config.apiKey,
    modelName: config.modelName,
    temperature: 0.8,
    maxTokens: 1000,
    configuration: {
        baseURL: config.baseURL,
    },
    // Add OpenRouter provider config to the request body
    modelKwargs: config.provider === 'openrouter' ? {
        provider: {
            ...config.openRouterConfig,
            data_collection: config.openRouterConfig?.data_collection ?? 'deny',
            sort: config.openRouterConfig?.sort ?? 'price',
            allow_fallbacks: config.openRouterConfig?.allow_fallbacks ?? true,
        }
    } : undefined
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
        modelName: 'perplexity/sonar',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    gemini: new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
        modelName: 'gemini-2.0-flash-lite-preview-02-05',
    }),

    mistral: createModel({
        provider: 'openrouter',
        modelName: 'mistralai/codestral-2501',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    cohere: createModel({
        provider: 'openrouter',
        modelName: 'cohere/command-r-03-2024',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    llama3: createModel({
        provider: 'openrouter',
        modelName: 'meta-llama/llama-3.3-70b-instruct',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    nvidia: createModel({
        provider: 'openrouter',
        modelName: 'nvidia/llama-3.1-nemotron-70b-instruct',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),

    gemini_thinking: new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY!,
        modelName: 'gemini-2.0-flash-thinking-exp-01-21',
    }),
    
    qwen: createModel({
        provider: 'openrouter',
        modelName: 'qwen/qwen-plus',
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1',
    }),
};
