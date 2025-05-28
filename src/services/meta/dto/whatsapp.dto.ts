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
  namedParamaterInput: {
    type: 'body';
    parameters: {
      type: string;
      parameter_name: string;
      text: string;
    }[];
  };
  positionalParamaterInput: {
    type: 'body';
    parameters: {
      type: string;
      parameter_name: string;
      text: string;
    }[];
  };
}
