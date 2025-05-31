import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATION_JOB_NAMES } from './jobs/jobs.names';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { MailService } from './mail/mail.service';
import { MessageService } from './message/message.service';
import { InAppService } from './in-app/in-app.service';
import { PushService } from './push/push.service';

@Module({
  imports: [
    ...Object.values(NOTIFICATION_JOB_NAMES).map((name) =>
      BullModule.registerQueue({
        name,
      }),
    ),
    ...Object.values(NOTIFICATION_JOB_NAMES).map((name) =>
      BullBoardModule.forFeature({
        name,
        adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
      }),
    ),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    MailService,
    MessageService,
    InAppService,
    PushService,
  ],
})
export class NotificationModule {}
