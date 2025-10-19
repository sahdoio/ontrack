import { Inject, Injectable } from '@nestjs/common';
import {
  CreateGroupInputDto,
  CreateGroupOutputDto,
} from '../dto/create-group.dto';
import { GROUP_REPOSITORY } from '../../domain/repositories/group.repository.interface';
import type { IGroupRepository } from '../../domain/repositories/group.repository.interface';
import { Member } from '../../domain/entities/member.entity';
import { Group } from '../../domain/entities/group.entity';
import { EVENT_BUS } from '../ports/event-bus.port';
import type { IEventBus } from '../ports/event-bus.port';

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: CreateGroupInputDto): Promise<CreateGroupOutputDto> {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Group name is required');
    }

    if (!input.memberNames || input.memberNames.length < 2) {
      throw new Error('At least 2 members are required');
    }

    // Create members
    const members: Member[] = input.memberNames.map((name) =>
      Member.create(name),
    );

    // Create group aggregate
    const group = Group.create(input.name, members);

    // Persist
    await this.groupRepository.save(group);

    // Publish domain events
    await this.eventBus.publishAll(group.getDomainEvents());
    group.clearDomainEvents();

    // Return output DTO
    return {
      id: group.id.value,
      name: group.name,
      members: group.members.map((m) => ({
        id: m.id.value,
        name: m.name,
        joinedAt: m.joinedAt,
      })),
      createdAt: group.createdAt,
    };
  }
}
