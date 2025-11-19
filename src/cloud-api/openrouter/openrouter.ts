import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openRouterAPIKey = process.env.OPENROUTER_API_KEY;
const openRouterBaseURL = "https://openrouter.ai/api/v1";

// OpenRouter models
export const openRouterLLMModel =
  process.env.OPENROUTER_LLM_MODEL || "mistralai/mistral-medium-3.1";
export const openRouterASRModel =
  process.env.OPENROUTER_ASR_MODEL || "mistralai/voxtral-small-24b-2507";

export const openrouter = openRouterAPIKey
  ? new OpenAI({
      apiKey: openRouterAPIKey,
      baseURL: openRouterBaseURL,
    })
  : null;
