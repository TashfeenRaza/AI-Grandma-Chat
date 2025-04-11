import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Initialize S3 client
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET || 'ai-grandma-video-chat';
  }

  /**
   * Uploads a file to S3 and returns the URL
   * @param key The S3 key (file path)
   * @param content The file content
   * @returns The URL of the uploaded file
   */
  public async uploadFile(key: string, content: Buffer): Promise<string> {
    try {
      // Set up the S3 upload parameters
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: this.getContentType(key),
      };

      // Upload the file
      await this.s3Client.send(new PutObjectCommand(params));

      // Generate and return the S3 URL
      const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      logger.info(`File uploaded to S3: ${url}`);
      
      return url;
    } catch (error) {
      logger.error(`Error uploading file to S3: ${error}`);
      throw new Error(`AWS S3 Error: ${(error as Error).message}`);
    }
  }

  /**
   * Determines the content type based on file extension
   * @param key The S3 key (file path)
   * @returns The content type
   */
  private getContentType(key: string): string {
    const ext = key.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'mp3':
        return 'audio/mpeg';
      case 'mp4':
        return 'video/mp4';
      default:
        return 'application/octet-stream';
    }
  }
} 