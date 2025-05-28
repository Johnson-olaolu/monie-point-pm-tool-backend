import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EnvironmentVariables } from 'src/config/env.config';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
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
}

@Injectable()
export class ResendService {
  private logger = new Logger(ResendService.name);
  private resend: Resend;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.resend = new Resend(configService.get('RESEND_API_KEY'));
  }

  /**
   * Send a single email
   */
  async sendEmail(options: SendEmailOptions): Promise<{ id: string }> {
    try {
      const emailData = {
        from: options.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc
            : [options.cc]
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc
            : [options.bcc]
          : undefined,
        reply_to: options.replyTo
          ? Array.isArray(options.replyTo)
            ? options.replyTo
            : [options.replyTo]
          : undefined,
        attachments: options.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          content_type: att.contentType,
        })),
        tags: options.tags,
        headers: options.headers,
      };

      const result = await this.resend.emails.send(emailData);

      if (result.error) {
        this.logger.error('Failed to send email:', result.error);
        throw new Error(`Failed to send email: ${result.error.message}`);
      }

      this.logger.log(`Email sent successfully with ID: ${result.data?.id}`);
      return { id: result.data?.id || '' };
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(emails: SendEmailOptions[]): Promise<{ id: string }[]> {
    try {
      const emailPromises = emails.map((email) => this.sendEmail(email));
      const results = await Promise.allSettled(emailPromises);

      const successfulResults: { id: string }[] = [];
      const failedResults: any[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulResults.push(result.value);
        } else {
          failedResults.push({ index, error: result.reason });
          this.logger.error(
            `Failed to send email at index ${index}:`,
            result.reason,
          );
        }
      });

      this.logger.log(
        `Bulk email send completed: ${successfulResults.length} successful, ${failedResults.length} failed`,
      );

      if (failedResults.length > 0) {
        this.logger.warn('Some emails failed to send:', failedResults);
      }

      return successfulResults;
    } catch (error) {
      this.logger.error('Error sending bulk emails:', error);
      throw error;
    }
  }
}
