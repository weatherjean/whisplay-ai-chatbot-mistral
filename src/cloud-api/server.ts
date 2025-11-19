import dotenv from "dotenv";
import {
  ChatWithLLMStreamFunction,
  RecognizeAudioFunction,
  ResetChatHistoryFunction,
  TTSProcessorFunction,
} from "./interface";
import {
  chatWithLLMStream as OpenRouterLLMStream,
  resetChatHistory as OpenRouterResetChatHistory,
} from "./openrouter/openrouter-llm";
import { recognizeAudio as OpenRouterASR } from "./openrouter/openrouter-asr";
import espeakTTS from "./local/espeak-tts";

dotenv.config();

// Bastard version: Single provider setup
// - LLM: OpenRouter (mistralai/mistral-medium-3.1)
// - ASR: OpenRouter (mistralai/voxtral-small-24b-2507)
// - TTS: espeak-ng (local, tiny, robotic but works)

console.log("=== Bastard Version ===");
console.log("LLM: OpenRouter (mistralai/mistral-medium-3.1)");
console.log("ASR: OpenRouter (mistralai/voxtral-small-24b-2507)");
console.log("TTS: espeak-ng (local, ~1MB)");
console.log("=======================");

// Direct assignment - no switching, no enums, no bullshit
export const recognizeAudio: RecognizeAudioFunction = OpenRouterASR;
export const chatWithLLMStream: ChatWithLLMStreamFunction = OpenRouterLLMStream;
export const resetChatHistory: ResetChatHistoryFunction = OpenRouterResetChatHistory;
export const ttsProcessor: TTSProcessorFunction = espeakTTS;
