import { AggregateRoot } from '../../../shared/domain/value-objects/aggregate-root.base';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';
import { MemberBalance } from '../value-objects/member-balance.vo';
import { BalanceCalculated } from '../events/balance-calculated.event';

/**
 * Balance Aggregate Root
 *
 * This is a read model (eventually consistent) that represents
 * the current balance state for all members in a group.
 */
export class Balance extends AggregateRoot<GroupId> {
  private _memberBalances: MemberBalance[];
  private _lastCalculatedAt: Date;

  private constructor(
    groupId: GroupId,
    memberBalances: MemberBalance[],
    lastCalculatedAt: Date,
  ) {
    super(groupId);
    this._memberBalances = memberBalances;
    this._lastCalculatedAt = lastCalculatedAt;
  }

  public static create(
    groupId: GroupId,
    memberBalances: MemberBalance[],
  ): Balance {
    const lastCalculatedAt = new Date();
    const balance = new Balance(groupId, memberBalances, lastCalculatedAt);

    // Emit domain event
    balance.addDomainEvent(
      new BalanceCalculated(
        groupId.value,
        memberBalances.map((mb) => ({
          memberId: mb.memberId.value,
          balance: mb.balance.amount,
        })),
      ),
    );

    return balance;
  }

  public static reconstitute(
    groupId: GroupId,
    memberBalances: MemberBalance[],
    lastCalculatedAt: Date,
  ): Balance {
    return new Balance(groupId, memberBalances, lastCalculatedAt);
  }

  get groupId(): GroupId {
    return this.id;
  }

  get memberBalances(): MemberBalance[] {
    return [...this._memberBalances]; // Return copy
  }

  get lastCalculatedAt(): Date {
    return this._lastCalculatedAt;
  }

  public updateBalances(memberBalances: MemberBalance[]): void {
    this._memberBalances = memberBalances;
    this._lastCalculatedAt = new Date();

    // Emit domain event
    this.addDomainEvent(
      new BalanceCalculated(
        this.id.value,
        memberBalances.map((mb) => ({
          memberId: mb.memberId.value,
          balance: mb.balance.amount,
        })),
      ),
    );
  }

  public getMemberBalance(memberId: string): MemberBalance | undefined {
    return this._memberBalances.find((mb) => mb.memberId.value === memberId);
  }
}
