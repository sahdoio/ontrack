import { ValueObject } from './value-object.base';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';
import { v7 as uuidv7, validate as isUuid } from 'uuid';

export abstract class Id extends ValueObject<Id> {
  protected readonly _value: string;

  protected constructor(value?: string) {
    super();
    if (value) {
      if (!isUuid(value)) {
        throw new InvalidArgumentException('Invalid UUID format');
      }
      this._value = value;
    } else {
      // Using UUID v7 for better database performance (time-ordered)
      this._value = uuidv7();
    }
  }

  get value(): string {
    return this._value;
  }

  protected getEqualityComponents(): any[] {
    return [this._value];
  }

  public toString(): string {
    return this._value;
  }
}

// Specific Identity Value Objects
export class GroupId extends Id {
  private constructor(value?: string) {
    super(value);
  }

  public static create(value?: string): GroupId {
    return new GroupId(value);
  }
}

export class MemberId extends Id {
  private constructor(value?: string) {
    super(value);
  }

  public static create(value?: string): MemberId {
    return new MemberId(value);
  }
}

export class ExpenseId extends Id {
  private constructor(value?: string) {
    super(value);
  }

  public static create(value?: string): ExpenseId {
    return new ExpenseId(value);
  }
}

export class SettlementId extends Id {
  private constructor(value?: string) {
    super(value);
  }

  public static create(value?: string): SettlementId {
    return new SettlementId(value);
  }
}
