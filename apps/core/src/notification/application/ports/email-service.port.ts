// Port for email service operations
export interface IEmailServicePort {
  send(to: string[], subject: string, body: string): Promise<void>;
  sendTemplate(to: string[], template: string, data: Record<string, any>): Promise<void>;
}

export const EMAIL_SERVICE_PORT = Symbol('IEmailServicePort');
