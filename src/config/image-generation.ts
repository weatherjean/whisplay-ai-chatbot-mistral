import { LLMTool } from "../type";

// Bastard version: Image generation disabled (no providers available)
export const addImageGenerationTools = (tools: LLMTool[]) => {
  console.log("Image generation tools: DISABLED (bastard version)");
  // No-op: no image generation in bastard version
};
