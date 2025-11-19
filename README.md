# Whisplay-AI-Chatbot (Bastard Version)

<img src="https://docs.pisugar.com/img/whisplay_logo@4x-8.png" alt="Whisplay AI Chatbot" width="200" />

This is a pocket-sized AI chatbot device built using a Raspberry Pi Zero 2w. Just press the button, speak, and it talks back—like a futuristic walkie-talkie with a mind of its own.

**Bastard Version**: Simplified, single-provider configuration using:
- **LLM**: OpenRouter → `mistralai/mistral-medium-3.1`
- **ASR** (Speech-to-Text): OpenRouter → `mistralai/voxtral-small-24b-2507`
- **TTS** (Text-to-Speech): espeak-ng (local, lightweight, ~1MB)

Test Video Playlist:
[https://www.youtube.com/watch?v=lOVA0Gui-4Q](https://www.youtube.com/playlist?list=PLpTS9YM-tG_mW5H7Xs2EO0qvlAI-Jm1e_)

Tutorial:
[https://www.youtube.com/watch?v=Nwu2DruSuyI](https://www.youtube.com/watch?v=Nwu2DruSuyI)

Tutorial 2 (offline version build on RPi 5B):
[https://www.youtube.com/watch?v=kFmhSTh167U](https://www.youtube.com/watch?v=kFmhSTh167U)

## Hardware

- Raspberry Pi zero 2w (Recommand)
- PiSugar Whisplay HAT (including LCD screen, on-board speaker and microphone)
- PiSugar 3 1200mAh

## Drivers

You need to firstly install the audio drivers for the Whisplay HAT. Follow the instructions in the [Whisplay HAT repository](https://github.com/PiSugar/whisplay).

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/PiSugar/whisplay-ai-chatbot.git
   cd whisplay-ai-chatbot
   ```
2. Install espeak-ng (lightweight TTS):
   ```bash
   sudo apt install espeak-ng
   ```
3. Install Node.js dependencies:
   ```bash
   bash install_dependencies.sh
   source ~/.bashrc
   ```
   Running `source ~/.bashrc` is necessary to load the new environment variables.
4. Create a `.env` file based on the `.env.template` file and fill in your OpenRouter API key.
5. Build the project:
   ```bash
   bash build.sh
   ```
6. Start the chatbot service:
   ```bash
   bash run_chatbot.sh
   ```
7. Optionally, set up the chatbot service to start on boot:
   ```bash
   sudo bash startup.sh
   ```
   Please note that this will disable the graphical interface and set the system to multi-user mode, which is suitable for headless operation.
   You can find the output logs at `chatbot.log`. Running `tail -f chatbot.log` will also display the logs in real-time.

## Build After Code Changes

If you make changes to the node code or just pull the new code from this repository, you need to rebuild the project. You can do this by running:

```bash
bash build.sh
```

If If you encounter `ModuleNotFoundError` or there's new third-party libraries to the python code, please run the following command to update the dependencies for python:
```
cd python
pip install -r requirements.txt --break-system-packages
```

## Update Environment Variables

If you need to update the environment variables, you can edit the `.env` file directly. After making changes, please restart the chatbot service with:

```bash
systemctl restart whisplay-ai-chatbot.service
```

## Image Generation

You can enable image generation by setting the `IMAGE_GENERATION_SERVER` variable in the `.env` file. Options include: OPENAI, GEMINI, VOLCENGINE.

Then you can use prompts like "A children's book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter." to generate images.

The generated images will be displayed on the screen and saved in the `data/images` folder.

## Display Battery Level

The battery level display depends on the pisugar-power-manager. If you are using PiSugar2 or PiSugar3, you need to install the pisugar-power-manager first. You can find the installation instructions in the [PiSugar Power Manager repository](https://github.com/PiSugar/pisugar-power-manager-rs).

Or use the following command to install it:

```bash
wget https://cdn.pisugar.com/release/pisugar-power-manager.sh
bash pisugar-power-manager.sh -c release
```

## Data Folder

The chatbot saves conversation history and generated images in the `data` folder. It's a temporal folder and can be deleted if you want to clear the history.

## Enclosure

[Whisplay Chatbot Case](https://github.com/PiSugar/suit-cases/tree/main/pisugar3-whisplay-chatbot)

## Configuration

1. Get your OpenRouter API key from [openrouter.ai](https://openrouter.ai/)
2. Copy `.env.template` to `.env`:
   ```bash
   cp .env.template .env
   ```
3. Edit `.env` and set your `OPENROUTER_API_KEY`
4. Install espeak-ng: `sudo apt install espeak-ng`

That's it! One API key for both LLM and speech recognition, plus lightweight local TTS.

## Features

- ✅ Tool calling / function execution (volume, weather, camera, etc.)
- ✅ Streaming responses for real-time interaction
- ✅ Chat history with auto-reset after 5 minutes of silence
- ✅ Local TTS (espeak-ng) - lightweight, works offline, sounds robotic but clear
- ✅ Camera support for vision tasks
- ✅ LCD display with Python renderer
- ✅ Battery level display (PiSugar)
- ✅ Pi Zero 2W compatible - minimal resource usage

## Original Multi-Provider Version

This is the **bastard version** - simplified to only use OpenRouter.
If you need multi-provider support (Gemini, OpenAI, Grok, Volcengine, etc.),
check the original repository or git history.

## License

[GPL-3.0](https://github.com/PiSugar/whisplay-ai-chatbot?tab=GPL-3.0-1-ov-file#readme)
