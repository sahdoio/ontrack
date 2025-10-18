import { Inject, Injectable } from '@nestjs/common';
import { AddMemberInputDto, AddMemberOutputDto } from '../dto/add-member.dto';
import { GROUP_REPOSITORY } from '../../domain/repositories/group.repository.interface';
import type { IGroupRepository } from '../../domain/repositories/group.repository.interface';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';
import { Member } from '../../domain/entities/member.entity';
import { EVENT_BUS } from '../ports/event-bus.port';
import type { IEventBus } from '../ports/event-bus.port';

@Injectable()
export class AddMemberToGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: AddMemberInputDto): Promise<AddMemberOutputDto> {
    // Load group
    const groupId = GroupId.create(input.groupId);
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

    // Create new member
    const member = Member.create(input.memberName);

    // Add member to group (domain logic enforces invariants)
    group.addMember(member);

    // Persist
    await this.groupRepository.save(group);

    // Publish domain events
    await this.eventBus.publishAll(group.getDomainEvents());
    group.clearDomainEvents();

    // Return output DTO
    return {
      memberId: member.id.value,
      memberName: member.name,
      joinedAt: member.joinedAt,
    };
  }
}
