import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';

const transportsConfig = {
  console: new winston.transports.Console({
    level: 'silly',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),

      winston.format.colorize({
        colors: {
          info: 'blue',
          debug: 'yellow',
          error: 'red',
        },
      }),

      winston.format.printf((info) => {
        return `${info.timestamp} [${info.level}] [${
          info.context ? info.context : info.stack
        }] ${info.message}`;
      }),
      winston.format.align(),
    ),
  }),

  combinedFile: new winstonDailyRotateFile({
    dirname: 'logs',
    filename: 'info',
    extension: '.log',
    level: 'info',
  }),
  errorFile: new winstonDailyRotateFile({
    dirname: 'logs',
    filename: 'error',
    extension: '.log',
    level: 'error',
  }),
};

export default transportsConfig;
