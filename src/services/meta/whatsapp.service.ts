import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  WhatsAppMessageDto,
  WhatsAppMessageResponseDto,
  WhatsAppMessageTemplateTextDto,
} from './dto/whatsapp.dto';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';

@Injectable()
export class MetaWhatsAppService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async sendWhatsappMessage(whatsAppMessageDto: WhatsAppMessageDto) {
    switch (whatsAppMessageDto.type) {
      case 'template-text':
        return await this.sendWhatsAppMessageTemplateText(
          whatsAppMessageDto.value,
        );

      default:
        break;
    }
  }

  private async sendWhatsAppMessageTemplateText(
    whatsAppMessageTemplateTextDto: WhatsAppMessageTemplateTextDto,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.post<WhatsAppMessageResponseDto>(
        `/${this.configService.get('META_PHONE_NUMBER_ID')}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: whatsAppMessageTemplateTextDto.recipientNumber,
          type: 'template',
          template: {
            name: whatsAppMessageTemplateTextDto.templateName,
            language: {
              code: 'LANGUAGE_AND_LOCALE_CODE',
            },
            components: [
              whatsAppMessageTemplateTextDto.namedParamaterInput,
              whatsAppMessageTemplateTextDto.positionalParamaterInput,
            ],
          },
        },
      ),
    );
    return data;
  }
}
