import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IGroupQueryPort } from '../../application/ports/group-query.port';
import { MemberEntity } from '../../../shared/infrastructure/database/entities/member.entity';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

@Injectable()
export class GroupQueryAdapter implements IGroupQueryPort {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async getMemberIds(groupId: GroupId): Promise<string[]> {
    const members = await this.memberRepository.find({
      where: { groupId: groupId.value },
      select: ['id'],
    });
    return members.map((m) => m.id);
  }
}
