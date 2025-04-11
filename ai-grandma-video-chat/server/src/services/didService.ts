import axios from 'axios';
import fs from 'fs';
import { setupLogger } from '../utils/logger';
import path from 'path';

const logger = setupLogger();

export class DIDService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.DID_API_KEY || '';
    this.apiUrl = 'https://api.d-id.com';
  }

  /**
   * Generates an animated video using D-ID's API
   * @param imageUrl URL to the source image
   * @param audioUrl URL to the audio file
   * @param outputPath Path to save the video file
   */
  public async generateVideo(imageUrl: string, audioUrl: string, outputPath: string): Promise<void> {
    try {
      logger.info(`Generating video animation with image: ${imageUrl} and audio: ${audioUrl}`);

      // Create a talking video with D-ID API
      const createResponse = await axios({
        method: 'post',
        url: `${this.apiUrl}/talks`,
        data: {
          source_url: imageUrl,
          audio_url: audioUrl,
          config: {
            fluent: true,
            pad_audio: 0.3, // Add a small pause at the end
            stitch: true,   // Remove jumps between expressions
          },
          // For a more grandma-like animation
          driver_url: "bank://lively", // More expressive animation
          webhook: null,
          result_format: "mp4"
        },
        headers: {
          'Authorization': `Basic ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const talkId = createResponse.data.id;
      logger.info(`Video creation initiated, talk ID: ${talkId}`);

      // Poll for completion
      let isCompleted = false;
      let attempts = 0;
      let videoUrl = '';

      while (!isCompleted && attempts < 30) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        // Check status
        const statusResponse = await axios({
          method: 'get',
          url: `${this.apiUrl}/talks/${talkId}`,
          headers: {
            'Authorization': `Basic ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        const status = statusResponse.data.status;
        
        if (status === 'done') {
          isCompleted = true;
          videoUrl = statusResponse.data.result_url;
          logger.info(`Video generation completed: ${videoUrl}`);
        } else if (status === 'error') {
          throw new Error(`D-ID Error: ${statusResponse.data.error}`);
        } else {
          logger.info(`Video generation in progress, status: ${status}`);
        }
      }

      if (!isCompleted) {
        throw new Error('D-ID Error: Video generation timed out');
      }

      // Download the video
      const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'arraybuffer'
      });

      // Ensure the directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save the video file
      fs.writeFileSync(outputPath, videoResponse.data);
      
      logger.info(`Video downloaded and saved to: ${outputPath}`);
    } catch (error) {
      logger.error(`D-ID API error: ${(error as Error).message}`);
      throw new Error(`D-ID Error: ${(error as Error).message}`);
    }
  }
} 