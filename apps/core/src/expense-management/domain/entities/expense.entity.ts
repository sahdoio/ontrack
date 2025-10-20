import { AggregateRoot } from '../../../shared/domain/value-objects/aggregate-root.base';
import {
  ExpenseId,
  GroupId,
  MemberId,
} from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { ExpenseSplit } from '../../../shared/domain/value-objects/expense-split.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { ExpenseRecorded } from '../events/expense-recorded.event';

export class Expense extends AggregateRoot<ExpenseId> {
  private readonly _groupId: GroupId;
  private readonly _payerId: MemberId;
  private _name: string;
  private readonly _amount: Money;
  private readonly _splits: ExpenseSplit[];
  private readonly _createdAt: Date;

  private constructor(
    id: ExpenseId,
    groupId: GroupId,
    payerId: MemberId,
    name: string,
    amount: Money,
    splits: ExpenseSplit[],
    createdAt: Date,
  ) {
    super(id);
    this._groupId = groupId;
    this._payerId = payerId;
    this._name = name;
    this._amount = amount;
    this._splits = splits;
    this._createdAt = createdAt;
  }

  public static create(
    groupId: GroupId,
    payerId: MemberId,
    name: string,
    amount: Money,
    splits: ExpenseSplit[],
    groupMemberIds: MemberId[],
    id?: ExpenseId,
  ): Expense {
    if (!name || name.trim().length === 0) {
      throw new InvalidArgumentException('Expense name cannot be empty');
    }

    if (name.trim().length > 200) {
      throw new InvalidArgumentException(
        'Expense name cannot exceed 200 characters',
      );
    }

    if (amount.isZero()) {
      throw new InvalidArgumentException(
        'Expense amount must be greater than zero',
      );
    }

    const totalSplits = splits.reduce(
      (sum, split) => sum.add(split.amount),
      Money.zero(amount.currency),
    );
    if (!totalSplits.equals(amount)) {
      throw new DomainException(
        `Splits must sum to total amount. Expected: ${amount.toString()}, Got: ${totalSplits.toString()}`,
      );
    }

    if (!groupMemberIds.some((id) => id.equals(payerId))) {
      throw new DomainException('Payer must be a member of the group');
    }

    for (const split of splits) {
      if (!groupMemberIds.some((id) => id.equals(split.memberId))) {
        throw new DomainException(
          'All split members must be members of the group',
        );
      }
    }

    const expenseId = id || ExpenseId.create();
    const createdAt = new Date();
    const expense = new Expense(
      expenseId,
      groupId,
      payerId,
      name.trim(),
      amount,
      splits,
      createdAt,
    );

    expense.addDomainEvent(
      new ExpenseRecorded(
        expenseId.value,
        groupId.value,
        payerId.value,
        name.trim(),
        amount.amount,
        splits.map((s) => ({
          memberId: s.memberId.value,
          amount: s.amount.amount,
        })),
      ),
    );

    return expense;
  }

  public static reconstitute(
    id: ExpenseId,
    groupId: GroupId,
    payerId: MemberId,
    name: string,
    amount: Money,
    splits: ExpenseSplit[],
    createdAt: Date,
  ): Expense {
    return new Expense(id, groupId, payerId, name, amount, splits, createdAt);
  }

  get groupId(): GroupId {
    return this._groupId;
  }

  get payerId(): MemberId {
    return this._payerId;
  }

  get name(): string {
    return this._name;
  }

  get amount(): Money {
    return this._amount;
  }

  get splits(): ExpenseSplit[] {
    return [...this._splits];
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidArgumentException('Expense name cannot be empty');
    }

    if (name.trim().length > 200) {
      throw new InvalidArgumentException(
        'Expense name cannot exceed 200 characters',
      );
    }

    this._name = name.trim();
  }

  public getSplitForMember(memberId: MemberId): ExpenseSplit | undefined {
    return this._splits.find((s) => s.memberId.equals(memberId));
  }
}
