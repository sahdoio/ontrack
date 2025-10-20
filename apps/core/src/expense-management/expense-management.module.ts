import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './presentation/controllers/expense.controller';
import { RecordExpenseUseCase } from './application/use-cases/record-expense.use-case';
import { ListGroupExpensesUseCase } from './application/use-cases/list-group-expenses.use-case';
import { ExpenseRepository } from './infrastructure/repositories/expense.repository';
import { GroupQueryAdapter } from './infrastructure/adapters/group-query.adapter';
import { EXPENSE_REPOSITORY } from './domain/repositories/expense.repository.interface';
import { GROUP_QUERY_PORT } from './application/ports/group-repository.port';
import { ExpenseEntity } from '../shared/infrastructure/database/entities/expense.entity';
import { ExpenseSplitEntity } from '../shared/infrastructure/database/entities/expense-split.entity';
import { GroupEntity } from '../shared/infrastructure/database/entities/group.entity';
import { MemberEntity } from '../shared/infrastructure/database/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseEntity,
      ExpenseSplitEntity,
      GroupEntity,
      MemberEntity,
    ]),
  ],
  controllers: [ExpenseController],
  providers: [
    RecordExpenseUseCase,
    ListGroupExpensesUseCase,
    {
      provide: EXPENSE_REPOSITORY,
      useClass: ExpenseRepository,
    },
    {
      provide: GROUP_QUERY_PORT,
      useClass: GroupQueryAdapter,
    },
  ],
  exports: [EXPENSE_REPOSITORY],
})
export class ExpenseManagementModule {}
