import { DomainException } from './domain.exception';

export class InvalidArgumentException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentException';
  }
}
