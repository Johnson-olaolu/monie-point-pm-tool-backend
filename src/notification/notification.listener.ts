import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { VerifyEmailNotificationDto } from './dto/verify-email-notification.dto';
import { MailService } from './mail/mail.service';
import { MessageService } from './message/message.service';
import { PushService } from './push/push.service';
import { InAppService } from './in-app/in-app.service';

@Injectable()
export class NotificationListener {
  constructor(
    private eventEmitter: EventEmitter2,
    private mailService: MailService,
    private messageService: MessageService,
    private pushService: PushService,
    private inAppService: InAppService,
  ) {}

  @OnEvent('notification.verify-email')
  handleVerifyEmailEvent(payload: VerifyEmailNotificationDto) {
    this.mailService.sendVerifyEmailMail(payload.user);
    this.messageService.sendVerifyEmailToken(payload.user);
  }
}
