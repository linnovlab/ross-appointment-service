import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import * as winston from 'winston';

import { AppModule } from './app.module';
import transportsConfig from './common/config/log/logger';
import { HttpGlobalExceptionFilter } from './common/config/exception/globalExceptionFilter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cors configs
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // log configs
  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        transportsConfig.console,
        transportsConfig.combinedFile,
        transportsConfig.errorFile,
      ],
    }),
  );

  // pipe validation
  app.useGlobalPipes(new ValidationPipe());

  // sentry config
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });

  // Import the filter globally, capturing all exceptions on all routes
  app.useGlobalFilters(new HttpGlobalExceptionFilter());
  await app.listen(process.env.APP_PORT || 5055);
}
bootstrap();
