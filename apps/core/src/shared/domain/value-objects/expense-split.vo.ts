import { ValueObject } from './value-object.base';
import { MemberId } from './id.vo';
import { Money } from './money.vo';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';

export class ExpenseSplit extends ValueObject<ExpenseSplit> {
  private readonly _memberId: MemberId;
  private readonly _amount: Money;

  private constructor(memberId: MemberId, amount: Money) {
    super();
    this._memberId = memberId;
    this._amount = amount;
  }

  public static create(memberId: MemberId, amount: Money): ExpenseSplit {
    if (!memberId) {
      throw new InvalidArgumentException('MemberId is required');
    }
    if (!amount) {
      throw new InvalidArgumentException('Amount is required');
    }
    if (amount.isZero()) {
      throw new InvalidArgumentException('Split amount cannot be zero');
    }
    return new ExpenseSplit(memberId, amount);
  }

  get memberId(): MemberId {
    return this._memberId;
  }

  get amount(): Money {
    return this._amount;
  }

  protected getEqualityComponents(): any[] {
    return [this._memberId.value, this._amount];
  }
}
