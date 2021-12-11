import winston from 'winston';
import path from 'path';

const commonFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.splat(),
  winston.format.json(),
);
const accessLogger = winston.createLogger({
  level: 'info',
  format: commonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname + '/../logs/access.log'),
      level: 'info',
    }),
  ],
});

const resLogger = winston.createLogger({
  level: 'info',
  format: commonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname + '/../logs/res.log'),
      level: 'info',
    }),
  ],
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: commonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname + '/../logs/error.log'),
      level: 'error',
    }),
  ],
});

const callbackLogger = winston.createLogger({
  level: 'info',
  format: commonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname + '/../logs/callback.log'),
      level: 'info',
    }),
  ],
});

const callbackErrorLogger = winston.createLogger({
  level: 'error',
  format: commonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname + '/../logs/callback--error.log'),
      level: 'error',
    }),
  ],
});

const cronJobErrorLogger = winston.createLogger({
  level: 'error',
  format: commonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname + '/../logs/cron-job-error.log'),
      level: 'error',
    }),
  ],
});

export {
  accessLogger,
  resLogger,
  errorLogger,
  callbackLogger,
  callbackErrorLogger,
  cronJobErrorLogger,
};
