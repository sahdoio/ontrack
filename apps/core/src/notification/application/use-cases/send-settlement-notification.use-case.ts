import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SERVICE_PORT } from '../ports/email-service.port';
import type { IEmailServicePort } from '../ports/email-service.port';

interface SettlementNotificationInput {
  groupName: string;
  payerName: string;
  receiverName: string;
  amount: number;
  payerEmail: string;
  receiverEmail: string;
}

@Injectable()
export class SendSettlementNotificationUseCase {
  constructor(
    @Inject(EMAIL_SERVICE_PORT)
    private readonly emailService: IEmailServicePort,
  ) {}

  async execute(input: SettlementNotificationInput): Promise<void> {
    const subject = `Debt Settled: ${input.payerName} paid ${input.receiverName}`;
    const body = `
      ${input.payerName} has paid $${(input.amount / 100).toFixed(2)} to ${input.receiverName}.

      This debt has been recorded in ${input.groupName}.
    `;

    await this.emailService.send(
      [input.payerEmail, input.receiverEmail],
      subject,
      body.trim(),
    );
  }
}
