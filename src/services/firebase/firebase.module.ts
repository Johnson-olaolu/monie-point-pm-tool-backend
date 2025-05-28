import { Module } from '@nestjs/common';
import { FirebaseMessagingService } from './firebase-messaging.service';
import { FirebaseRealtimeDBService } from './firebase-realtimeDB.service';

@Module({
  imports: [],
  providers: [FirebaseMessagingService, FirebaseRealtimeDBService],
  exports: [FirebaseMessagingService, FirebaseRealtimeDBService],
})
export class FirebaseModule {}
