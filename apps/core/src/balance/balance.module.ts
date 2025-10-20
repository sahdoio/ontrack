import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceController } from './presentation/controllers/balance.controller';
import { CalculateGroupBalancesUseCase } from './application/use-cases/calculate-group-balances.use-case';
import { GetMemberBalanceUseCase } from './application/use-cases/get-member-balance.use-case';
import { BalanceRepository } from './infrastructure/repositories/balance.repository';
import { ExpenseQueryAdapter } from './infrastructure/adapters/expense-query.adapter';
import { SettlementQueryAdapter } from './infrastructure/adapters/settlement-query.adapter';
import { GroupQueryAdapter } from './infrastructure/adapters/group-query.adapter';
import { ExpenseRecordedHandler } from './application/event-handlers/expense-recorded.handler';
import { DebtSettledHandler } from './application/event-handlers/debt-settled.handler';
import { BALANCE_REPOSITORY } from './domain/repositories/balance.repository.interface';
import { EXPENSE_QUERY_PORT } from './application/ports/expense-query.port';
import { SETTLEMENT_QUERY_PORT } from './application/ports/settlement-query.port';
import { GROUP_QUERY_PORT } from './application/ports/group-query.port';
import { BalanceEntity } from '../shared/infrastructure/database/entities/balance.entity';
import { ExpenseEntity } from '../shared/infrastructure/database/entities/expense.entity';
import { ExpenseSplitEntity } from '../shared/infrastructure/database/entities/expense-split.entity';
import { SettlementEntity } from '../shared/infrastructure/database/entities/settlement.entity';
import { MemberEntity } from '../shared/infrastructure/database/entities/member.entity';
import { SQSConsumerService } from '../shared/infrastructure/messaging/sqs-consumer.service';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BalanceEntity,
      ExpenseEntity,
      ExpenseSplitEntity,
      SettlementEntity,
      MemberEntity,
    ]),
  ],
  controllers: [BalanceController],
  providers: [
    CalculateGroupBalancesUseCase,
    GetMemberBalanceUseCase,
    ExpenseRecordedHandler,
    DebtSettledHandler,
    {
      provide: BALANCE_REPOSITORY,
      useClass: BalanceRepository,
    },
    {
      provide: EXPENSE_QUERY_PORT,
      useClass: ExpenseQueryAdapter,
    },
    {
      provide: SETTLEMENT_QUERY_PORT,
      useClass: SettlementQueryAdapter,
    },
    {
      provide: GROUP_QUERY_PORT,
      useClass: GroupQueryAdapter,
    },
  ],
  exports: [BALANCE_REPOSITORY],
})
export class BalanceModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly sqsConsumer: SQSConsumerService,
    private readonly expenseRecordedHandler: ExpenseRecordedHandler,
    private readonly debtSettledHandler: DebtSettledHandler,
  ) {}

  onModuleInit() {
    this.sqsConsumer.registerHandler(this.expenseRecordedHandler);
    this.sqsConsumer.registerHandler(this.debtSettledHandler);
  }
}
