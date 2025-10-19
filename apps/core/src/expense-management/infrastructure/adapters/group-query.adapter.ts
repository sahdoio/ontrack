import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IGroupQueryPort } from '../../application/ports/group-repository.port';
import { GroupEntity } from '../../../shared/infrastructure/database/entities/group.entity';
import { MemberEntity } from '../../../shared/infrastructure/database/entities/member.entity';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

@Injectable()
export class GroupQueryAdapter implements IGroupQueryPort {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async exists(groupId: GroupId): Promise<boolean> {
    const count = await this.groupRepository.count({
      where: { id: groupId.value },
    });
    return count > 0;
  }

  async getMemberIds(groupId: GroupId): Promise<string[]> {
    const members = await this.memberRepository.find({
      where: { groupId: groupId.value },
      select: ['id'],
    });
    return members.map((m) => m.id);
  }
}
