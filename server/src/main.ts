import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@app/app.module';
import { setupSwagger } from '@app/swagger/swagger.setup';
import { setupConfig } from '@app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_CONFIG').PORT;

  setupConfig(app);
  setupSwagger(app);

  await app.listen(port);
}
bootstrap();
