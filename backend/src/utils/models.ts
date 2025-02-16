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
    onCallModel?: boolean;
}) => ({
    model: config.provider === 'deepseek' || config.provider === 'openrouter' 
        ? new ChatOpenAI({
            openAIApiKey: config.apiKey,
            modelName: config.modelName,
            temperature: 0.4,
            maxTokens: 1200,
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
    },
    onCallModel: config.onCallModel ?? false
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

    aion_labs_1_mini: createModel({
        provider: 'openrouter',
        modelName: 'aion-labs/aion-1.0',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 4,
            output: 8
        }
    }),
    gpt4oMini: createModel({
        provider: 'openrouter',
        modelName: 'openai/gpt-4o-mini',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.15,
            output: 0.60
        }
    }),

    amazon_nova_micro_1: createModel({
        provider: 'openrouter',
        modelName: 'amazon/nova-micro-v1',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.035,
            output: 0.14
        },
        onCallModel: true
    }),

    claude_3_5_haiku: createModel({
        provider: 'openrouter',
        modelName: 'anthropic/claude-3-5-haiku:beta',
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
        },
        onCallModel: true
    }),

    mistral: createModel({
        provider: 'openrouter',
        modelName: 'mistralai/codestral-2501',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.3,
            output: 0.9
        },
        onCallModel: true
    }),

    cohere: createModel({
        provider: 'openrouter',
        modelName: 'cohere/command-r7b-12-2024',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.075,
            output: 0.30
        },
        onCallModel: true
    }),

    perplexity_sonar_small: createModel({
        provider: 'openrouter',
        modelName: 'perplexity/llama-3.1-sonar-small-128k-chat',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 1,
            output: 1
        }
    }),

    qwen_deepseek_r1_distill: createModel({
        provider: 'openrouter',
        modelName: 'qwen/qwen-turbo',
        apiKey: process.env.OPENROUTER_API_KEY!,
        price: {
            input: 0.05,
            output: 0.2
        }
    }),
};
