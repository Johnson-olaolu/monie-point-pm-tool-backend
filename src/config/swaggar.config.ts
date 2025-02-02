import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from 'src/metadata';

export const configureSwagger = async (app: INestApplication, path: string) => {
  const config = new DocumentBuilder()
    .setTitle('Discount Hub Documentation')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
};
