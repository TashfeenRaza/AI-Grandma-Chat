import { Request, Response, NextFunction } from 'express';
import { S3Service } from '../services/s3Service';
import { FaceDetectionService } from '../services/faceDetectionService';
import { setupLogger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const logger = setupLogger();
const s3Service = new S3Service();
const faceDetectionService = new FaceDetectionService();

export class PhotoController {
  /**
   * Handles photo upload, validates face presence, and uploads to S3
   */
  public uploadPhoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      logger.info(`Processing uploaded file: ${req.file.filename}`);

      // Check if the image contains a face
      const filePath = req.file.path;
      const hasFace = await faceDetectionService.detectFace(filePath);

      if (!hasFace) {
        // Delete the file if no face is detected
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          error: 'No face detected in the uploaded image. Please upload a photo with a clear face.' 
        });
      }

      // Upload to S3
      const fileContent = fs.readFileSync(filePath);
      const s3Key = `photos/${req.file.filename}`;
      const s3Url = await s3Service.uploadFile(s3Key, fileContent);

      // Return success response with photo ID (the S3 key)
      logger.info(`File successfully processed and uploaded to S3: ${s3Key}`);
      return res.status(200).json({
        message: 'Photo uploaded successfully',
        photoId: s3Key,
        photoUrl: s3Url
      });

    } catch (error) {
      // Pass error to the error handler middleware
      next(error);
    }
  };
} 