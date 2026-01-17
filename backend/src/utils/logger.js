const winston = require('winston');
const path = require('path');

const logDir = process.env.LOG_FILE_PATH || './logs';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'attendance-api' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Helper methods
logger.logRequest = (req, res, duration) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
};

logger.logError = (error, req = null) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    userId: req?.user?.id
  });
};

logger.logAuth = (action, userId, success, details = {}) => {
  logger.info('Authentication event', {
    action,
    userId,
    success,
    ...details
  });
};

logger.logAttendance = (action, studentId, sessionId, success, details = {}) => {
  logger.info('Attendance event', {
    action,
    studentId,
    sessionId,
    success,
    ...details
  });
};

// Morgan stream for HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;