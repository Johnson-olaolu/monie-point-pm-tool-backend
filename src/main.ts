import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swaggar.config';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');
  configureSwagger(app, 'documentation');
  await app.listen(
    app.get(ConfigService<EnvironmentVariables>).get('PORT'),
    () => {
      new Logger('Documentation').log(
        `http://localhost:${app.get(ConfigService<EnvironmentVariables>).get('PORT')}/documentation`,
      );
    },
  );
}
bootstrap();
