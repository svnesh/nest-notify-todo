import * as winston from 'winston';
import {
  winstonConsoleFormat,
  winstonCustomFormat,
  winstonErrorFormat,
} from './winston.format';

const isDevlopment = process.env.NODE_ENV === 'dev';
const winstonTransports = {
  dev: [
    new winston.transports.Console({
      format: winstonConsoleFormat,
      level: 'silly',
    }),
    new winston.transports.Console({
      format: winstonErrorFormat,
      level: 'error',
    }),
  ],
  prod: [
    new winston.transports.Console({ format: winstonConsoleFormat }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: winstonErrorFormat,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winstonCustomFormat,
    }),
  ],
};

export const loggerInstance = winston.createLogger({
  level: 'silly',
  transports: isDevlopment
    ? winstonTransports['dev']
    : winstonTransports['prod'],
});
