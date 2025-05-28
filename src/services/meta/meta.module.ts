import { Module } from '@nestjs/common';
import { MetaWhatsAppService } from './whatsapp.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        // timeout: 1000000,
        maxRedirects: 5,
        baseURL: configService.get('META_BASE_URL'),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configService.get('META_ACCESS_TOKEN')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MetaWhatsAppService],
  exports: [MetaWhatsAppService],
})
export class MetaModule {}
