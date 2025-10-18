import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGroupRepository } from '../../domain/repositories/group.repository.interface';
import { Group } from '../../domain/entities/group.entity';
import { Member } from '../../domain/entities/member.entity';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { GroupEntity } from '../../../shared/infrastructure/database/entities/group.entity';
import { MemberEntity } from '../../../shared/infrastructure/database/entities/member.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupEntityRepository: Repository<GroupEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberEntityRepository: Repository<MemberEntity>,
  ) {}

  async save(group: Group): Promise<void> {
    // Map domain entity to ORM entity
    const groupEntity = new GroupEntity();
    groupEntity.id = group.id.value;
    groupEntity.name = group.name;
    groupEntity.createdAt = group.createdAt;

    // Save group
    await this.groupEntityRepository.save(groupEntity);

    // Delete existing members (simple approach for updates)
    await this.memberEntityRepository.delete({ groupId: group.id.value });

    // Save members
    const memberEntities = group.members.map((member) => {
      const memberEntity = new MemberEntity();
      memberEntity.id = member.id.value;
      memberEntity.groupId = group.id.value;
      memberEntity.name = member.name;
      memberEntity.joinedAt = member.joinedAt;
      return memberEntity;
    });

    if (memberEntities.length > 0) {
      await this.memberEntityRepository.save(memberEntities);
    }
  }

  async findById(id: GroupId): Promise<Group | null> {
    const groupEntity = await this.groupEntityRepository.findOne({
      where: { id: id.value },
      relations: ['members'],
    });

    if (!groupEntity) {
      return null;
    }

    return this.toDomain(groupEntity);
  }

  async findAll(): Promise<Group[]> {
    const groupEntities = await this.groupEntityRepository.find({
      relations: ['members'],
    });

    return groupEntities.map((entity) => this.toDomain(entity));
  }

  async delete(id: GroupId): Promise<void> {
    await this.groupEntityRepository.delete({ id: id.value });
  }

  async exists(id: GroupId): Promise<boolean> {
    const count = await this.groupEntityRepository.count({
      where: { id: id.value },
    });
    return count > 0;
  }

  private toDomain(groupEntity: GroupEntity): Group {
    // Map ORM entity to domain entity
    const members = groupEntity.members.map((memberEntity) =>
      Member.reconstitute(
        MemberId.create(memberEntity.id),
        memberEntity.name,
        memberEntity.joinedAt,
      ),
    );

    return Group.reconstitute(
      GroupId.create(groupEntity.id),
      groupEntity.name,
      members,
      groupEntity.createdAt,
    );
  }
}
