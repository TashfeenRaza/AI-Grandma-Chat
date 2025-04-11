import { Request, Response, NextFunction } from 'express';
import { S3Service } from '../services/s3Service';
import { OpenAIService } from '../services/openaiService';
import { ElevenLabsService } from '../services/elevenLabsService';
import { DIDService } from '../services/didService';
import { setupLogger } from '../utils/logger';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const logger = setupLogger();
const s3Service = new S3Service();
const openaiService = new OpenAIService();
const elevenLabsService = new ElevenLabsService();
const didService = new DIDService();

export class ResponseController {
  /**
   * Generates an AI response to the user's question
   */
  public generateResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      logger.info(`Generating response for question: ${question}`);

      // 1. Upload photo to S3 (if not already uploaded)
      const filePath = req.file.path;
      const fileContent = fs.readFileSync(filePath);
      const s3Key = `photos/${req.file.filename}`;
      const photoUrl = await s3Service.uploadFile(s3Key, fileContent);

      // 2. Generate grandma-style text response using GPT-4
      const textResponse = await openaiService.generateGrandmaResponse(question);
      logger.info(`Generated text response: ${textResponse}`);

      // 3. Convert text to speech using ElevenLabs
      const audioFileName = `${uuidv4()}.mp3`;
      const audioFilePath = path.join(__dirname, '../../uploads/audio', audioFileName);
      
      // Ensure audio directory exists
      const audioDir = path.dirname(audioFilePath);
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }

      await elevenLabsService.generateSpeech(textResponse, audioFilePath);
      logger.info(`Generated audio file: ${audioFilePath}`);

      // 4. Upload audio to S3
      const audioContent = fs.readFileSync(audioFilePath);
      const audioS3Key = `audio/${audioFileName}`;
      const audioUrl = await s3Service.uploadFile(audioS3Key, audioContent);

      // 5. Generate animated video using D-ID API
      const videoFileName = `${uuidv4()}.mp4`;
      const videoFilePath = path.join(__dirname, '../../uploads/video', videoFileName);
      
      // Ensure video directory exists
      const videoDir = path.dirname(videoFilePath);
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      await didService.generateVideo(photoUrl, audioUrl, videoFilePath);
      logger.info(`Generated video file: ${videoFilePath}`);

      // 6. Upload video to S3
      const videoContent = fs.readFileSync(videoFilePath);
      const videoS3Key = `video/${videoFileName}`;
      const videoUrl = await s3Service.uploadFile(videoS3Key, videoContent);

      // 7. Return video URL to the client
      return res.status(200).json({
        message: 'Response generated successfully',
        videoUrl: videoUrl,
        text: textResponse
      });

    } catch (error) {
      // Pass error to the error handler middleware
      next(error);
    }
  };
} 