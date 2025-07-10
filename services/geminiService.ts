import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from "../types";

// Configuration interface for Gemini API
interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
}

// Custom error class for Gemini API errors
class GeminiApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

// Environment configuration with fallbacks
const GEMINI_CONFIG: GeminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || 'AIzaSyCAjw8lY4uekRFDX50bXK13FpKVW10bBcE',
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-04-17',
  temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
  topP: parseFloat(process.env.GEMINI_TOP_P || '0.9'),
  topK: parseInt(process.env.GEMINI_TOP_K || '40', 10)
};

// Validate API key
const validateGeminiApiKey = (apiKey: string): boolean => {
  if (!apiKey || apiKey.trim() === '') {
    throw new GeminiApiError(
      'Gemini API key is required. Please set GEMINI_API_KEY or API_KEY environment variable.',
      'MISSING_API_KEY'
    );
  }
  return true;
};

// Validate configuration
validateGeminiApiKey(GEMINI_CONFIG.apiKey);

// Initialize GoogleGenAI instance
const ai = new GoogleGenAI({ apiKey: GEMINI_CONFIG.apiKey });
let chat: Chat | null = null;

// Initialize chat with financial data context
const initializeChat = (
  financialDataSummary: string,
  customConfig?: Partial<GeminiConfig>
): void => {
  const config = { ...GEMINI_CONFIG, ...customConfig };
  
  const systemInstruction = `You are a friendly and expert financial advisor for a user in India. Your name is 'Fi Agent'.

You must provide insights based ONLY on the structured JSON data provided below. Do not invent or assume any other financial details.
Always format monetary values in Indian Rupees (₹) with appropriate commas (e.g., ₹1,23,456).
Be encouraging, clear, and actionable in your advice. You can perform simulations if asked.

Here is the user's complete financial data:
---
${financialDataSummary}
---

Begin the first conversation by introducing yourself and asking how you can help.
`;

  try {
    chat = ai.chats.create({
      model: config.model!,
      config: {
        systemInstruction: systemInstruction,
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
      },
    });
  } catch (error) {
    throw new GeminiApiError(
      `Failed to initialize chat: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CHAT_INIT_ERROR'
    );
  }
};

// Main chat response function with improved error handling
export const getChatResponse = async (
  prompt: string,
  history: ChatMessage[],
  financialDataSummary: string,
  options?: {
    customConfig?: Partial<GeminiConfig>;
    maxRetries?: number;
  }
): Promise<string> => {
  const maxRetries = options?.maxRetries || 3;
  let retryCount = 0;

  const attemptRequest = async (): Promise<string> => {
    try {
      // Initialize chat if needed
      if (!chat || history.length === 0) {
        initializeChat(financialDataSummary, options?.customConfig);
      }

      // Guard against initialization failure
      if (!chat) {
        throw new GeminiApiError("Chat not initialized", 'CHAT_NOT_INITIALIZED');
      }

      // Send message and get response
      const response = await chat.sendMessage({ message: prompt });
      
      if (!response.text) {
        throw new GeminiApiError("Empty response from Gemini API", 'EMPTY_RESPONSE');
      }

      return response.text;

    } catch (error) {
      // Handle specific API errors
      if (error instanceof Error) {
        // Rate limiting
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Rate limited. Retrying in ${delay}ms... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return attemptRequest();
          }
          throw new GeminiApiError("Rate limit exceeded. Please try again later.", 'RATE_LIMIT_EXCEEDED');
        }

        // API key issues
        if (error.message.includes('API key') || error.message.includes('401')) {
          throw new GeminiApiError("Invalid API key. Please check your Gemini API key.", 'INVALID_API_KEY');
        }

        // Quota exceeded
        if (error.message.includes('quota') || error.message.includes('403')) {
          throw new GeminiApiError("API quota exceeded. Please check your billing.", 'QUOTA_EXCEEDED');
        }
      }

      // Re-throw if it's already a GeminiApiError
      if (error instanceof GeminiApiError) {
        throw error;
      }

      // Generic error
      throw new GeminiApiError(
        `Gemini API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GENERAL_ERROR'
      );
    }
  };

  try {
    return await attemptRequest();
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Return user-friendly error messages
    if (error instanceof GeminiApiError) {
      switch (error.code) {
        case 'MISSING_API_KEY':
          return "Configuration error: API key not found. Please contact support.";
        case 'INVALID_API_KEY':
          return "Authentication error: Invalid API key. Please contact support.";
        case 'RATE_LIMIT_EXCEEDED':
          return "I'm receiving too many requests right now. Please wait a moment and try again.";
        case 'QUOTA_EXCEEDED':
          return "Service temporarily unavailable due to quota limits. Please try again later.";
        default:
          return "I'm sorry, I encountered a technical error. Please try again in a moment.";
      }
    }

    return "I'm sorry, I encountered an unexpected error while processing your request. Please try again.";
  }
};

// Utility function to test Gemini API key
export const testGeminiApiKey = async (
  apiKey?: string
): Promise<{ valid: boolean; message?: string }> => {
  const testKey = apiKey || GEMINI_CONFIG.apiKey;
  
  try {
    validateGeminiApiKey(testKey);
    
    const testAI = new GoogleGenAI({ apiKey: testKey });
    const testChat = testAI.chats.create({
      model: GEMINI_CONFIG.model!,
      config: {
        systemInstruction: "You are a test assistant. Respond with 'Test successful'.",
        temperature: 0.1,
      },
    });

    const response = await testChat.sendMessage({ message: "Test" });
    
    if (response.text) {
      return { valid: true, message: "API key is valid and working" };
    } else {
      return { valid: false, message: "API key valid but no response received" };
    }

  } catch (error) {
    console.error('Gemini API key test failed:', error);
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Unknown error during API key validation'
    };
  }
};

// Function to reset chat (useful for new conversations)
export const resetChat = (): void => {
  chat = null;
};

// Function to get current configuration
export const getGeminiConfig = (): GeminiConfig => {
  return { ...GEMINI_CONFIG };
};

// Function to update configuration (useful for testing different settings)
export const updateGeminiConfig = (newConfig: Partial<GeminiConfig>): void => {
  Object.assign(GEMINI_CONFIG, newConfig);
  if (newConfig.apiKey) {
    validateGeminiApiKey(newConfig.apiKey);
  }
  // Reset chat to apply new configuration
  resetChat();
};