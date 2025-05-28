import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables, validateEnv } from './config/env.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SeedModule } from './seed/seed.module';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        store: redisStore,
        ttl: configService.get('CACHE_TTL'),
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          // password: configService.get('REDIS_PASSWORD') ?? undefined,
          // username: configService.get('REDIS_USERNAME') ?? undefined,
          // Add retry strategy and error handling
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000); // Adjust retry strategy as needed
          },
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
    }),
    AuthModule,
    UserModule,
    SeedModule,
    DatabaseModule,
    NotificationModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
