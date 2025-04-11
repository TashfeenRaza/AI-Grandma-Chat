import winston from 'winston';
import path from 'path';

export const setupLogger = () => {
  // Create logs directory if it doesn't exist
  const logDir = path.join(__dirname, '../../logs');
  
  // Define log format
  const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    })
  );
  
  // Create logger
  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
      // Console transport
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          logFormat
        )
      }),
      
      // File transport for errors
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error'
      }),
      
      // File transport for all logs
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log')
      })
    ]
  });
  
  return logger;
}; 