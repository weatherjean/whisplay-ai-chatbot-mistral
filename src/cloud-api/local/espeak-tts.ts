import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";
import { getWavFileDurationMs } from "../../utils";
import { ttsDir } from "../../utils/dir";

const espeakTTS = async (
  text: string
): Promise<{ data: Buffer; duration: number }> => {
  return new Promise((resolve, reject) => {
    const tempWavFile = path.join(ttsDir, `espeak_${Date.now()}.wav`);

    // espeak-ng -w output.wav "text to speak"
    const espeakProcess = spawn("espeak-ng", [
      "-w",
      tempWavFile,
      text,
    ]);

    espeakProcess.on("close", async (code: number) => {
      if (code !== 0) {
        console.error(`espeak-ng process exited with code ${code}`);
        resolve({ data: Buffer.from([]), duration: 0 });
        return;
      }

      if (fs.existsSync(tempWavFile) === false) {
        console.log("espeak-ng output file not found:", tempWavFile);
        resolve({ data: Buffer.from([]), duration: 0 });
        return;
      }

      try {
        const buffer = fs.readFileSync(tempWavFile);
        const duration = getWavFileDurationMs(buffer);

        // Clean up temp file
        fs.unlinkSync(tempWavFile);

        // Remove WAV header (44 bytes), otherwise playback process will stop automatically
        const headerSize = 44;
        const trimmedBuffer = buffer.subarray(headerSize);
        resolve({ data: trimmedBuffer, duration });
      } catch (error) {
        console.log("Error processing espeak-ng output:", `"${text}"`, error);
        resolve({ data: Buffer.from([]), duration: 0 });
      }
    });

    espeakProcess.on("error", (error: any) => {
      console.log("espeak-ng process error:", `"${text}"`, error);
      console.log("Make sure espeak-ng is installed: sudo apt install espeak-ng");
      resolve({ data: Buffer.from([]), duration: 0 });
    });
  });
};

export default espeakTTS;
