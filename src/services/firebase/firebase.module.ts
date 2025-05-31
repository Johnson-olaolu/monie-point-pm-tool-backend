import { Module } from '@nestjs/common';
import { FirebaseMessagingService } from './firebase-messaging.service';
import { FirebaseRealtimeDBService } from './firebase-realtimeDB.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

@Module({
  imports: [],
  providers: [
    {
      provide: 'FIREBASE_APP',
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return initializeApp({
          credential: credential.cert({
            projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: configService
              .get<string>('FIREBASE_PRIVATE_KEY')
              ?.replace(/\\n/g, '\n'),
          }),
          databaseURL: configService.get('FIREBASE_DATABSE_URL'),
        });
      },
    },
    FirebaseMessagingService,
    FirebaseRealtimeDBService,
  ],
  exports: [FirebaseMessagingService, FirebaseRealtimeDBService],
})
export class FirebaseModule {}
