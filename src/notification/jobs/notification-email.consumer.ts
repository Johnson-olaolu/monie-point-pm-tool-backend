import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { NOTIFICATION_JOB_NAMES } from './jobs.names';
import { Job } from 'bullmq';
import { ResendService } from 'src/services/resend.service';
import { renderTemplate } from 'src/utils/misc';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';

export type NotificationEmailConsumerPayload = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string | number>;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
  headers?: Record<string, string>;
};

@Processor(NOTIFICATION_JOB_NAMES.NOTIFICATION_EMAIL)
export class NotificationEmailConsumer extends WorkerHost {
  constructor(
    private resendService: ResendService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    super();
  }
  async process(
    job: Job<NotificationEmailConsumerPayload, any, string>,
  ): Promise<any> {
    // do some stuff
    const html = await renderTemplate(job.data.template, job.data.context);
    return await this.resendService.sendEmail({
      to: job.data.to,
      subject: job.data.subject,
      from: job.data.from || this.configService.get('MAIL_FROM'),
      html,
      ...job.data,
    });
  }

  //   @OnWorkerEvent('active')
  //   onActive(job: Job) {
  //     console.log(
  //       `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
  //     );
  //   }

  @OnWorkerEvent('error')
  onError(job: Job) {
    console.log(
      `Error with job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(
      `Processed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
