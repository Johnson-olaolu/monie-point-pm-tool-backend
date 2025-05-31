export class WhatsAppMessageResponseDto {
  'messaging_product': string;
  'contacts': [
    {
      input: string;
      wa_id: string;
    },
  ];
  'messages': [
    {
      id: string;
    },
  ];
}

export class WhatsAppMessageTemplateTextDto {
  recipientNumber: string;
  templateName: string;
  namedParamaterInput?: {
    type: 'body' | 'header';
    parameters: {
      type: 'text';
      parameter_name: string;
      text: string;
    }[];
  };
  positionalParamaterInput?: {
    type: 'body' | 'header';
    parameters: {
      type: 'text';
      text: string;
    }[];
  };
}

export type WhatsappMessageMap = {
  'template-text': WhatsAppMessageTemplateTextDto;
};

// export type WhatsAppMessageDto = {<T extends keyof WhatsappMessageMap>(type: T, data: WhatsappMessageMap[T]) }
export type WhatsAppMessageDto = {
  [T in keyof WhatsappMessageMap]: {
    type: T;
    value: WhatsappMessageMap[T];
  };
}[keyof WhatsappMessageMap];
