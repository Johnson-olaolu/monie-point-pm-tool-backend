import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { NOTIFICATION_JOB_NAMES } from '../jobs/jobs.names';
import { Queue } from 'bullmq';
import { WhatsAppMessageDto } from 'src/services/meta/dto/whatsapp.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue(NOTIFICATION_JOB_NAMES.NOTIFICATION_MESSAGES)
    private notificationMailQueue: Queue<WhatsAppMessageDto, any, any>,
  ) {}

  async sendVerifyEmailToken(user: User) {
    this.notificationMailQueue.add('verify-email-token', {
      type: 'template-text',
      value: {
        templateName: 'verification_token',
        recipientNumber: user.profile.phoneNumber,
        positionalParamaterInput: {
          type: 'body',
          parameters: [{ type: 'text', text: user.emailVerificationToken }],
        },
      },
    });
  }
}
