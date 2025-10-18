import { Money } from '../../../shared/domain/value-objects/money.vo';
import { MemberId } from '../../../shared/domain/value-objects/id.vo';
import { MemberBalance } from '../value-objects/member-balance.vo';

/**
 * Domain Service: BalanceCalculator
 *
 * Formula per member:
 * Net Balance =
 *   (Splits owed to me - what I paid for expenses)
 *   + (Settlements I received - Settlements I paid)
 *
 * Positive balance = Member is owed money
 * Negative balance = Member owes money
 */
export class BalanceCalculator {
  public static calculateMemberBalances(
    memberIds: MemberId[],
    expenses: Array<{
      payerId: MemberId;
      amount: Money;
      splits: Array<{ memberId: MemberId; amount: Money }>;
    }>,
    settlements: Array<{
      payerId: MemberId;
      receiverId: MemberId;
      amount: Money;
    }>,
  ): MemberBalance[] {
    const balances = new Map<string, Money>();

    // Initialize all member balances to zero
    const currency = expenses.length > 0 ? expenses[0].amount.currency : 'USD';
    memberIds.forEach((memberId) => {
      balances.set(memberId.value, Money.zero(currency));
    });

    // Process expenses
    for (const expense of expenses) {
      const payerId = expense.payerId.value;

      // Payer paid the full amount (positive contribution)
      const currentPayerBalance = balances.get(payerId) || Money.zero(currency);
      balances.set(payerId, currentPayerBalance.add(expense.amount));

      // Each member owes their split (negative contribution)
      for (const split of expense.splits) {
        const memberId = split.memberId.value;
        const currentBalance = balances.get(memberId) || Money.zero(currency);
        balances.set(memberId, currentBalance.subtract(split.amount));
      }
    }

    // Process settlements
    for (const settlement of settlements) {
      const payerId = settlement.payerId.value;
      const receiverId = settlement.receiverId.value;

      // Payer paid (negative for payer)
      const currentPayerBalance = balances.get(payerId) || Money.zero(currency);
      balances.set(payerId, currentPayerBalance.subtract(settlement.amount));

      // Receiver received (positive for receiver)
      const currentReceiverBalance = balances.get(receiverId) || Money.zero(currency);
      balances.set(receiverId, currentReceiverBalance.add(settlement.amount));
    }

    // Convert map to MemberBalance array
    const memberBalances: MemberBalance[] = [];
    memberIds.forEach((memberId) => {
      const balance = balances.get(memberId.value) || Money.zero(currency);
      memberBalances.push(MemberBalance.create(memberId, balance));
    });

    return memberBalances;
  }
}
