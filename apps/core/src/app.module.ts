import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { GroupManagementModule } from './group-management/group-management.module';
import { ExpenseManagementModule } from './expense-management/expense-management.module';
import { SettlementModule } from './settlement/settlement.module';
import { BalanceModule } from './balance/balance.module';
import { FileProcessingModule } from './file-processing/file-processing.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    SharedModule,
    GroupManagementModule,
    ExpenseManagementModule,
    SettlementModule,
    BalanceModule,
    FileProcessingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
