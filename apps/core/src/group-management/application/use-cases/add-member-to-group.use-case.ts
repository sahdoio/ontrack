import { Inject, Injectable } from '@nestjs/common';
import { AddMemberInputDto, AddMemberOutputDto } from '../dto/add-member.dto';
import { GROUP_REPOSITORY } from '../../domain/repositories/group.repository.interface';
import type { IGroupRepository } from '../../domain/repositories/group.repository.interface';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';
import { Member } from '../../domain/entities/member.entity';
import { EVENT_BUS } from '../../../shared/application/ports/event-bus.port';
import type { IEventBus } from '../../../shared/application/ports/event-bus.port';

@Injectable()
export class AddMemberToGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: AddMemberInputDto): Promise<AddMemberOutputDto> {
    const groupId = GroupId.create(input.groupId);
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    const member = Member.create(input.memberName);

    group.addMember(member);

    await this.groupRepository.save(group);

    await this.eventBus.publishAll(group.getDomainEvents());
    group.clearDomainEvents();

    return {
      memberId: member.id.value,
      memberName: member.name,
      joinedAt: member.joinedAt,
    };
  }
}
