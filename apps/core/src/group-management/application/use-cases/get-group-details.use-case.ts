import { Inject, Injectable } from '@nestjs/common';
import { GetGroupDetailsInputDto, GetGroupDetailsOutputDto } from '../dto/get-group-details.dto';
import { GROUP_REPOSITORY } from '../../domain/repositories/group.repository.interface';
import type { IGroupRepository } from '../../domain/repositories/group.repository.interface';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

@Injectable()
export class GetGroupDetailsUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(input: GetGroupDetailsInputDto): Promise<GetGroupDetailsOutputDto> {
    // Load group
    const groupId = GroupId.create(input.groupId);
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new Error('Group not found');
    }

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
      memberCount: group.getMemberCount(),
    };
  }
}
