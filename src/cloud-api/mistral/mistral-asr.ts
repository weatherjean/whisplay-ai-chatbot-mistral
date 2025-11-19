import fs from "fs";
import { mistral, mistralASRModel } from "./mistral";

export const recognizeAudio = async (
  audioFilePath: string
): Promise<string> => {
  if (!mistral) {
    console.error("Mistral API key is not set.");
    return "";
  }
  if (!fs.existsSync(audioFilePath)) {
    console.error("Audio file does not exist:", audioFilePath);
    return "";
  }

  try {
    const audioFile = fs.readFileSync(audioFilePath);
    const response = await mistral.audio.transcriptions.complete({
      model: mistralASRModel,
      file: {
        fileName: audioFilePath.split("/").pop() || "audio.wav",
        content: audioFile,
      },
    });

    console.log("Transcription result:", response.text);
    return response.text || "";
  } catch (error) {
    console.error("Audio recognition failed:", error);
    return "";
  }
};
