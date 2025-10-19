import { Money } from '../../../shared/domain/value-objects/money.vo';
import { ExpenseSplit } from '../../../shared/domain/value-objects/expense-split.vo';
import { MemberId } from '../../../shared/domain/value-objects/id.vo';

/**
 * Domain Service: SplitCalculator
 *
 * Algorithm:
 * 1. Base amount = floor(total / member count)
 * 2. Remainder = total - (base × count)
 * 3. First member gets base + remainder (deterministic)
 *
 * Example: $100 / 3 = [$34, $33, $33]
 */
export class SplitCalculator {
  public static calculateEqualSplits(
    totalAmount: Money,
    memberIds: MemberId[],
  ): ExpenseSplit[] {
    if (memberIds.length === 0) {
      throw new Error('Cannot split expense among zero members');
    }

    const baseAmount = totalAmount.divide(memberIds.length);
    const totalDistributed = baseAmount.multiply(memberIds.length);
    const remainder = totalAmount.subtract(totalDistributed);

    const splits: ExpenseSplit[] = [];

    // First member gets base + remainder
    splits.push(ExpenseSplit.create(memberIds[0], baseAmount.add(remainder)));

    // Rest get base amount
    for (let i = 1; i < memberIds.length; i++) {
      splits.push(ExpenseSplit.create(memberIds[i], baseAmount));
    }

    return splits;
  }

  public static validateSplits(
    totalAmount: Money,
    splits: ExpenseSplit[],
  ): boolean {
    if (splits.length === 0) {
      return false;
    }

    const sumOfSplits = splits.reduce(
      (sum, split) => sum.add(split.amount),
      Money.zero(totalAmount.currency),
    );

    return sumOfSplits.equals(totalAmount);
  }
}
