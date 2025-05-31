import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { NOTIFICATION_JOB_NAMES } from '../jobs/jobs.names';
import { Queue } from 'bullmq';
import { NotificationEmailConsumerPayload } from '../jobs/notification-email.consumer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(NOTIFICATION_JOB_NAMES.NOTIFICATION_EMAIL)
    private notificationMailQueue: Queue<
      NotificationEmailConsumerPayload,
      any,
      any
    >,
  ) {}

  async sendVerifyEmailMail(user: User) {
    this.notificationMailQueue.add('verification-email', {
      context: {
        name: user.name,
        otp: user.emailVerificationToken,
        expiryTime: '30 minutes',
      },
      subject: 'Please Confirm Your Email',
      template: 'verify-email',
      to: user.email,
    });
  }
}
