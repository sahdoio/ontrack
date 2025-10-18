import { AggregateRoot } from '../../../shared/domain/value-objects/aggregate-root.base';
import { SettlementId, GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { DebtSettled } from '../events/debt-settled.event';

export class Settlement extends AggregateRoot<SettlementId> {
  private readonly _groupId: GroupId;
  private readonly _payerId: MemberId;
  private readonly _receiverId: MemberId;
  private readonly _amount: Money;
  private readonly _createdAt: Date;

  private constructor(
    id: SettlementId,
    groupId: GroupId,
    payerId: MemberId,
    receiverId: MemberId,
    amount: Money,
    createdAt: Date,
  ) {
    super(id);
    this._groupId = groupId;
    this._payerId = payerId;
    this._receiverId = receiverId;
    this._amount = amount;
    this._createdAt = createdAt;
  }

  public static create(
    groupId: GroupId,
    payerId: MemberId,
    receiverId: MemberId,
    amount: Money,
    groupMemberIds: MemberId[],
    id?: SettlementId,
  ): Settlement {
    // Invariant: Amount must be positive
    if (amount.isZero()) {
      throw new InvalidArgumentException('Settlement amount must be greater than zero');
    }

    // Invariant: Payer ≠ Receiver
    if (payerId.equals(receiverId)) {
      throw new InvalidArgumentException('Payer and receiver cannot be the same person');
    }

    // Validate payer and receiver are group members
    if (!groupMemberIds.some((id) => id.equals(payerId))) {
      throw new DomainException('Payer must be a member of the group');
    }

    if (!groupMemberIds.some((id) => id.equals(receiverId))) {
      throw new DomainException('Receiver must be a member of the group');
    }

    const settlementId = id || SettlementId.create();
    const createdAt = new Date();
    const settlement = new Settlement(
      settlementId,
      groupId,
      payerId,
      receiverId,
      amount,
      createdAt,
    );

    // Emit domain event
    settlement.addDomainEvent(
      new DebtSettled(
        settlementId.value,
        groupId.value,
        payerId.value,
        receiverId.value,
        amount.amount,
      ),
    );

    return settlement;
  }

  public static reconstitute(
    id: SettlementId,
    groupId: GroupId,
    payerId: MemberId,
    receiverId: MemberId,
    amount: Money,
    createdAt: Date,
  ): Settlement {
    return new Settlement(id, groupId, payerId, receiverId, amount, createdAt);
  }

  get groupId(): GroupId {
    return this._groupId;
  }

  get payerId(): MemberId {
    return this._payerId;
  }

  get receiverId(): MemberId {
    return this._receiverId;
  }

  get amount(): Money {
    return this._amount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
