import winston from "winston";

export const winstonConsoleFormat = winston.format.combine(
  winston.format.colorize({ colors: { info: 'green', error: 'red', warn: 'yellow' } }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const logContext = info.context ? `[${info.context}] ` : '';
    return `${info.timestamp} - ${logContext}[${info.level}]: ${info.message}`
  }),
  winston.format.ms(),
);

export const winstonCustomFormat = winston.format.combine(
  winston.format.uncolorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const logContext = info.context ? `[${info.context}] ` : '';
    return `${info.timestamp} - ${logContext}[${info.level}]: ${info.message}`
  }),
  winston.format.ms(),
);

export const winstonErrorFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.json(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const logContext = info.context ? `[${info.context}] ` : '';
    const logTraceId = info.traceId ? `[TraceID: ${info.traceId}] ` : '';
    return `${info.timestamp} - ${logContext}${logTraceId}[${info.level}]: ${info.message}`
  }),
  winston.format.ms(),
)