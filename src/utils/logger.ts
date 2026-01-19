import * as winston from "winston";
import { winstonConsoleFormat, winstonCustomFormat, winstonErrorFormat } from "./winston.format";


export const loggerInstance = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console({ format: winstonConsoleFormat }),
      new winston.transports.File({ filename: 'error.log', level: 'error', format: winstonErrorFormat }),
      new winston.transports.File({ filename: 'combined.log', format: winstonCustomFormat }),
    ]
  });