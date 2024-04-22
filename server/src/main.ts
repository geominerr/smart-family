import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@app/app.module';
import { setupSwagger } from '@app/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_CONFIG').PORT;
  const clientUrl = configService.get('APP_CONFIG').CLIENT_URL;

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({ origin: clientUrl, credentials: true });

  setupSwagger(app);

  await app.listen(port);
}
bootstrap();
