import { Processor } from '@nestjs/bullmq';
import { NOTIFICATION_JOB_NAMES } from './jobs.names';

@Processor(NOTIFICATION_JOB_NAMES.NOTIFICATION_PUSH)
export class NotificationPushConsumer {}
