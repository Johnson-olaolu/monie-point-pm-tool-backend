import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { NOTIFICATION_JOB_NAMES } from './jobs.names';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';
import { MetaWhatsAppService } from 'src/services/meta/whatsapp.service';
import { Job } from 'bullmq';
import { WhatsAppMessageDto } from 'src/services/meta/dto/whatsapp.dto';

@Processor(NOTIFICATION_JOB_NAMES.NOTIFICATION_MESSAGES)
export class NotificationMessagesConsumer extends WorkerHost {
  constructor(
    private metaWhatsAppService: MetaWhatsAppService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {
    super();
  }
  async process(job: Job<WhatsAppMessageDto, any, string>): Promise<any> {
    // do some stuff
    this.metaWhatsAppService.sendWhatsappMessage(job.data);
  }

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
