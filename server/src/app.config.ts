import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

export const setupConfig = (app: INestApplication): void => {
  const configService = app.get(ConfigService);
  const clientUrl = configService.get('APP_CONFIG').CLIENT_URL;

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({ origin: clientUrl, credentials: true });
};
