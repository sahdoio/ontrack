import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceController } from './presentation/controllers/balance.controller';
import { CalculateGroupBalancesUseCase } from './application/use-cases/calculate-group-balances.use-case';
import { GetMemberBalanceUseCase } from './application/use-cases/get-member-balance.use-case';
import { BalanceRepository } from './infrastructure/repositories/balance.repository';
import { ExpenseQueryAdapter } from './infrastructure/adapters/expense-query.adapter';
import { SettlementQueryAdapter } from './infrastructure/adapters/settlement-query.adapter';
import { GroupQueryAdapter } from './infrastructure/adapters/group-query.adapter';
import { BALANCE_REPOSITORY } from './domain/repositories/balance.repository.interface';
import { EXPENSE_QUERY_PORT } from './application/ports/expense-query.port';
import { SETTLEMENT_QUERY_PORT } from './application/ports/settlement-query.port';
import { GROUP_QUERY_PORT } from './application/ports/group-query.port';
import { EVENT_BUS } from './application/ports/event-bus.port';
import { InMemoryEventBusAdapter } from '../shared/infrastructure/event-bus/in-memory-event-bus.adapter';
import { BalanceEntity } from '../shared/infrastructure/database/entities/balance.entity';
import { ExpenseEntity } from '../shared/infrastructure/database/entities/expense.entity';
import { ExpenseSplitEntity } from '../shared/infrastructure/database/entities/expense-split.entity';
import { SettlementEntity } from '../shared/infrastructure/database/entities/settlement.entity';
import { MemberEntity } from '../shared/infrastructure/database/entities/member.entity';

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
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBusAdapter,
    },
  ],
  exports: [BALANCE_REPOSITORY],
})
export class BalanceModule {}
