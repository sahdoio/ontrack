import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettlementController } from './presentation/controllers/settlement.controller';
import { RecordSettlementUseCase } from './application/use-cases/record-settlement.use-case';
import { ListSettlementsUseCase } from './application/use-cases/list-settlements.use-case';
import { SettlementRepository } from './infrastructure/repositories/settlement.repository';
import { GroupQueryAdapter } from './infrastructure/adapters/group-query.adapter';
import { SETTLEMENT_REPOSITORY } from './domain/repositories/settlement.repository.interface';
import { GROUP_QUERY_PORT } from './application/ports/group-query.port';
import { SettlementEntity } from '../shared/infrastructure/database/entities/settlement.entity';
import { GroupEntity } from '../shared/infrastructure/database/entities/group.entity';
import { MemberEntity } from '../shared/infrastructure/database/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SettlementEntity, GroupEntity, MemberEntity]),
  ],
  controllers: [SettlementController],
  providers: [
    RecordSettlementUseCase,
    ListSettlementsUseCase,
    {
      provide: SETTLEMENT_REPOSITORY,
      useClass: SettlementRepository,
    },
    {
      provide: GROUP_QUERY_PORT,
      useClass: GroupQueryAdapter,
    },
  ],
  exports: [SETTLEMENT_REPOSITORY],
})
export class SettlementModule {}
