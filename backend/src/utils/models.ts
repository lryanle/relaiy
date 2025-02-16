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
    provider: 'deepseek' | 'openrouter' | 'gemini';
    modelName: string;
    apiKey: string;
    openRouterConfig?: OpenRouterConfig;
    price?: {
        input: number;
        output: number;
    };
}) => ({
    model: config.provider === 'deepseek' || config.provider === 'openrouter' 
        ? new ChatOpenAI({
            openAIApiKey: config.apiKey,
            modelName: config.modelName,
            temperature: 0.8,
            maxTokens: 1000,
            configuration: {
                baseURL: config.provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.deepseek.com/v1',
            },
            modelKwargs: config.provider === 'openrouter' ? {
                provider: {
                    ...config.openRouterConfig,
                    data_collection: config.openRouterConfig?.data_collection ?? 'deny',
                    sort: config.openRouterConfig?.sort ?? process.env.NODE_ENV === 'production' ? 'throughput' : 'price',
                    allow_fallbacks: config.openRouterConfig?.allow_fallbacks ?? true,
                }
            } : undefined
        })
        : new ChatGoogleGenerativeAI({
            apiKey: config.apiKey,
            modelName: config.modelName,
        }),
    price: {
        input: config.price?.input ?? 0,
        output: config.price?.output ?? 0,
    }
});

// Initialize models
export const models = {
    // deepseek: createModel({
    //     provider: 'deepseek',
    //     modelName: 'deepseek-chat',
    //     apiKey: process.env.DEEPSEEK_API_KEY!,
    //     price: {
    //         input: 0.27,
    //         output: 1.10
    //     }
    // }),

    gpt4oMini: createModel({
        provider: 'openrouter',
        modelName: 'openai/gpt-4o-mini',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.15,
            output: 0.60
        }
    }),

    // sonar: createModel({
    //     provider: 'openrouter',
    //     modelName: 'perplexity/sonar',
    //     apiKey: process.env.OPENROUTER_API_KEY!,
    //     price: {
    //         input: 1,
    //         output: 1
    //     }
    // }),

    claude_3_5_haiku: createModel({
        provider: 'openrouter',
        modelName: 'anthropic/claude-3-5-haiku',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.5,
            output: 2
        }
    }),
    gemini: createModel({
        provider: 'gemini',
        modelName: 'gemini-2.0-flash-lite-preview-02-05',
        apiKey: process.env.GEMINI_API_KEY!,
        price: {
            input: 0.075,
            output: 0.30
        }
    }),

    mistral: createModel({
        provider: 'openrouter',
        modelName: 'mistralai/codestral-2501',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.3,
            output: 0.9
        }
    }),

    cohere: createModel({
        provider: 'openrouter',
        modelName: 'cohere/command-r7b-12-2024',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.075,
            output: 0.30
        }
    }),

    // nvidia: createModel({
    //     provider: 'openrouter',
    //     modelName: 'nvidia/llama-3.1-nemotron-70b-instruct',
    //     apiKey: process.env.OPENROUTER_API_KEY!,
    //     price: {
    //         input: 1,
    //         output: 1
    //     }
    // }),

    gemini_flash_thinking: createModel({
        provider: 'gemini',
        modelName: 'gemini-2.0-flash-thinking-exp-01-21',
        apiKey: process.env.GEMINI_API_KEY!,
        price: {
            input: 0,
            output: 0
        }
    }),

    qwen: createModel({
        provider: 'openrouter',
        modelName: 'qwen/qwen-plus',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.4,
            output: 1.2
        }
    }),
};
