import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SERVICE_PORT } from '../ports/email-service.port';
import type { IEmailServicePort } from '../ports/email-service.port';

interface ExpenseNotificationInput {
  groupName: string;
  payerName: string;
  expenseName: string;
  amount: number;
  memberEmails: string[];
}

@Injectable()
export class SendExpenseNotificationUseCase {
  constructor(
    @Inject(EMAIL_SERVICE_PORT)
    private readonly emailService: IEmailServicePort,
  ) {}

  async execute(input: ExpenseNotificationInput): Promise<void> {
    const subject = `New Expense: ${input.expenseName} in ${input.groupName}`;
    const body = `
      ${input.payerName} paid $${(input.amount / 100).toFixed(2)} for "${input.expenseName}".

      Check your balance to see how much you owe.

      Group: ${input.groupName}
    `;

    await this.emailService.send(input.memberEmails, subject, body.trim());
  }
}
