import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './config/swaggar.config';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
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
