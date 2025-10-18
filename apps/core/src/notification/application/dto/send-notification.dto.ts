export class SendNotificationInputDto {
  to: string[]; // email addresses
  subject: string;
  body: string;
  metadata?: Record<string, any>;
}

export class SendNotificationOutputDto {
  sent: boolean;
  recipientCount: number;
  message: string;
}
