import { ValueObject } from './value-object.base';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';

export class Money extends ValueObject<Money> {
  private readonly _amount: number; // stored as cents
  private readonly _currency: string;

  private constructor(amount: number, currency: string = 'USD') {
    super();
    this._amount = amount;
    this._currency = currency;
  }

  public static fromCents(cents: number, currency: string = 'USD'): Money {
    if (!Number.isInteger(cents)) {
      throw new InvalidArgumentException('Amount in cents must be an integer');
    }
    if (cents < 0) {
      throw new InvalidArgumentException('Amount cannot be negative');
    }
    return new Money(cents, currency);
  }

  public static fromDollars(dollars: number, currency: string = 'USD'): Money {
    if (dollars < 0) {
      throw new InvalidArgumentException('Amount cannot be negative');
    }
    const cents = Math.round(dollars * 100);
    return new Money(cents, currency);
  }

  public static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get dollars(): number {
    return this._amount / 100;
  }

  public add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new InvalidArgumentException('Subtraction would result in negative amount');
    }
    return new Money(result, this._currency);
  }

  public multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new InvalidArgumentException('Multiplier cannot be negative');
    }
    const result = Math.round(this._amount * multiplier);
    return new Money(result, this._currency);
  }

  public divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new InvalidArgumentException('Divisor must be positive');
    }
    const result = Math.floor(this._amount / divisor);
    return new Money(result, this._currency);
  }

  public isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  public isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount < other._amount;
  }

  public isZero(): boolean {
    return this._amount === 0;
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new InvalidArgumentException(
        `Cannot perform operation on different currencies: ${this._currency} and ${other._currency}`,
      );
    }
  }

  protected getEqualityComponents(): any[] {
    return [this._amount, this._currency];
  }

  public toString(): string {
    return `${this._currency} ${this.dollars.toFixed(2)}`;
  }
}
