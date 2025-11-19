import fs from "fs";
import { openrouter, openRouterASRModel } from "./openrouter";

export const recognizeAudio = async (
  audioFilePath: string
): Promise<string> => {
  if (!openrouter) {
    console.error("OpenRouter API key is not set.");
    return "";
  }
  if (!fs.existsSync(audioFilePath)) {
    console.error("Audio file does not exist:", audioFilePath);
    return "";
  }

  try {
    // Read and encode audio file to base64
    const audioBuffer = fs.readFileSync(audioFilePath);
    const audioBase64 = audioBuffer.toString("base64");

    // Determine audio format from file extension
    const format = audioFilePath.endsWith(".mp3") ? "mp3" : "wav";

    // Use OpenRouter with Voxtral for transcription
    const response = await openrouter.chat.completions.create({
      model: openRouterASRModel,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "input_audio",
              input_audio: {
                data: audioBase64,
                format: format,
              },
            } as any,
            {
              type: "text",
              text: "Transcribe this audio accurately. Return only the transcribed text with no additional commentary.",
            },
          ] as any,
        },
      ],
    });

    const transcription = response.choices[0].message.content || "";
    console.log("Transcription result:", transcription);
    return transcription;
  } catch (error) {
    console.error("Audio recognition failed:", error);
    return "";
  }
};
