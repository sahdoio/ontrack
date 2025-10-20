import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './presentation/controllers/group.controller';
import { CreateGroupUseCase } from './application/use-cases/create-group.use-case';
import { AddMemberToGroupUseCase } from './application/use-cases/add-member-to-group.use-case';
import { GetGroupDetailsUseCase } from './application/use-cases/get-group-details.use-case';
import { GroupRepository } from './infrastructure/repositories/group.repository';
import { GROUP_REPOSITORY } from './domain/repositories/group.repository.interface';
import { GroupEntity } from '../shared/infrastructure/database/entities/group.entity';
import { MemberEntity } from '../shared/infrastructure/database/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, MemberEntity])],
  controllers: [GroupController],
  providers: [
    CreateGroupUseCase,
    AddMemberToGroupUseCase,
    GetGroupDetailsUseCase,
    {
      provide: GROUP_REPOSITORY,
      useClass: GroupRepository,
    },
  ],
  exports: [GROUP_REPOSITORY],
})
export class GroupManagementModule {}
