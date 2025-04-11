import axios from 'axios';
import fs from 'fs';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class ElevenLabsService {
  private apiKey: string;
  private apiUrl: string;
  private voiceId: string;

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
    this.apiUrl = 'https://api.elevenlabs.io/v1';
    // Voice ID for "old_female_01" - replace with actual voice ID from ElevenLabs
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || 'pFZP5JQG7iQjIQuC4Bku';
  }

  /**
   * Generates speech from text using ElevenLabs API
   * @param text The text to convert to speech
   * @param outputPath The path to save the audio file
   */
  public async generateSpeech(text: string, outputPath: string): Promise<void> {
    try {
      logger.info(`Generating speech for text: "${text}"`);

      // Set up API request
      const url = `${this.apiUrl}/text-to-speech/${this.voiceId}`;
      
      // Configure voice settings for warm, slightly scolding grandmother tone
      const voiceSettings = {
        stability: 0.75,    // Higher values make voice more stable and less expressive
        similarity_boost: 0.8,  // Higher values make voice more similar to the reference
        style: 0.35,        // Higher values make voice more stylized
        use_speaker_boost: true // Improves quality of voice
      };

      // Make API request to ElevenLabs
      const response = await axios({
        method: 'post',
        url: url,
        data: {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings
        },
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        responseType: 'arraybuffer'
      });

      // Ensure the directory exists
      const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save audio file
      fs.writeFileSync(outputPath, response.data);
      
      logger.info(`Speech generated and saved to: ${outputPath}`);
    } catch (error) {
      logger.error(`ElevenLabs API error: ${(error as Error).message}`);
      throw new Error(`ElevenLabs Error: ${(error as Error).message}`);
    }
  }
} 