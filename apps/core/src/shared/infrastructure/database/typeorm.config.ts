import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GroupEntity } from './entities/group.entity';
import { MemberEntity } from './entities/member.entity';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseSplitEntity } from './entities/expense-split.entity';
import { SettlementEntity } from './entities/settlement.entity';
import { BalanceEntity } from './entities/balance.entity';

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'ontrack'),
  entities: [
    GroupEntity,
    MemberEntity,
    ExpenseEntity,
    ExpenseSplitEntity,
    SettlementEntity,
    BalanceEntity,
  ],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
  logging: configService.get('DB_LOGGING', 'false') === 'true',
  poolSize: 20,
  connectTimeoutMS: 5000,
});

// For migrations CLI
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'ontrack',
  entities: [
    GroupEntity,
    MemberEntity,
    ExpenseEntity,
    ExpenseSplitEntity,
    SettlementEntity,
    BalanceEntity,
  ],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
