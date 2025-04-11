import { Request, Response, NextFunction } from 'express';
import { setupLogger } from '../utils/logger';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
}

const logger = setupLogger();

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack || '');

  // Default status code
  const statusCode = err.status || 500;

  // Check for specific error types
  if (err.message.includes('multer')) {
    return res.status(400).json({
      error: 'File upload error. Please check file size and type.'
    });
  }

  // Handle AWS S3 errors
  if (err.code && err.code.startsWith('AWS')) {
    return res.status(503).json({
      error: 'Storage service unavailable. Please try again later.'
    });
  }

  // Handle D-ID API errors
  if (err.message.includes('D-ID')) {
    return res.status(503).json({
      error: 'Video generation service unavailable. Please try again later.'
    });
  }

  // Handle ElevenLabs API errors
  if (err.message.includes('ElevenLabs')) {
    return res.status(503).json({
      error: 'Voice generation service unavailable. Please try again later.'
    });
  }

  // Handle OpenAI API errors
  if (err.message.includes('OpenAI')) {
    return res.status(503).json({
      error: 'AI service unavailable. Please try again later.'
    });
  }

  // General server error
  if (statusCode === 500) {
    return res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }

  // Return specific error with status code
  return res.status(statusCode).json({
    error: err.message
  });
}; 