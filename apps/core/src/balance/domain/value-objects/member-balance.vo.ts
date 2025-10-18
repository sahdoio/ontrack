import { ValueObject } from '../../../shared/domain/value-objects/value-object.base';
import { MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

export class MemberBalance extends ValueObject<MemberBalance> {
  private readonly _memberId: MemberId;
  private readonly _balance: Money;

  private constructor(memberId: MemberId, balance: Money) {
    super();
    this._memberId = memberId;
    this._balance = balance;
  }

  public static create(memberId: MemberId, balance: Money): MemberBalance {
    return new MemberBalance(memberId, balance);
  }

  get memberId(): MemberId {
    return this._memberId;
  }

  get balance(): Money {
    return this._balance;
  }

  public isPositive(): boolean {
    return this._balance.isGreaterThan(Money.zero(this._balance.currency));
  }

  public isNegative(): boolean {
    return this._balance.isLessThan(Money.zero(this._balance.currency));
  }

  public isZero(): boolean {
    return this._balance.isZero();
  }

  protected getEqualityComponents(): any[] {
    return [this._memberId.value, this._balance];
  }
}
