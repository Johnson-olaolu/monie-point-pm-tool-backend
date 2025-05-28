export interface NotificationPayloadDto {
  title: string;
  body: string;
  data?: { [key: string]: string };
  imageUrl?: string;
}

export interface SendNotificationOptionsDto {
  token?: string;
  tokens?: string[];
  topic?: string;
  condition?: string;
}
