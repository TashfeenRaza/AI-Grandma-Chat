import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Validation schema for photo upload
const uploadSchema = Joi.object({
  // No specific field requirements, just checking for file presence in middleware
});

// Validation schema for response generation
const generateSchema = Joi.object({
  question: Joi.string().required().trim().min(3).max(500)
    .messages({
      'string.empty': 'Question is required',
      'string.min': 'Question must be at least 3 characters long',
      'string.max': 'Question cannot exceed 500 characters',
      'any.required': 'Question is required'
    })
});

/**
 * Validates photo upload request
 */
export const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ 
      error: 'Photo is required. Please upload an image file.' 
    });
  }

  // Validation passed
  next();
};

/**
 * Validates response generation request
 */
export const validateGenerateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ 
      error: 'Photo is required. Please upload an image file.' 
    });
  }

  // Validate question
  const { error } = generateSchema.validate({ question: req.body.question });
  
  if (error) {
    return res.status(400).json({ 
      error: error.details[0].message 
    });
  }

  // Validation passed
  next();
}; 