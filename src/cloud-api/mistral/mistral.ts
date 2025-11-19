import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const mistralAPIKey = process.env.MISTRAL_API_KEY;

// Mistral LLM
export const mistralLLMModel =
  process.env.MISTRAL_LLM_MODEL || "devstral-medium-2507"; // Default model

// Mistral ASR
export const mistralASRModel =
  process.env.MISTRAL_ASR_MODEL || "voxtral-mini-latest"; // Default transcription model

export const mistral = mistralAPIKey
  ? new Mistral({ apiKey: mistralAPIKey })
  : null;
