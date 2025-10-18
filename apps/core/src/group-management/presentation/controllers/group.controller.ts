import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateGroupRequestDto } from '../dto/create-group.request.dto';
import { CreateGroupResponseDto } from '../dto/create-group.response.dto';
import { AddMemberRequestDto } from '../dto/add-member.request.dto';
import { GroupDetailsResponseDto } from '../dto/group-details.response.dto';
import { CreateGroupUseCase } from '../../application/use-cases/create-group.use-case';
import { AddMemberToGroupUseCase } from '../../application/use-cases/add-member-to-group.use-case';
import { GetGroupDetailsUseCase } from '../../application/use-cases/get-group-details.use-case';

@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly addMemberToGroupUseCase: AddMemberToGroupUseCase,
    private readonly getGroupDetailsUseCase: GetGroupDetailsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully', type: CreateGroupResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createGroup(@Body() request: CreateGroupRequestDto): Promise<CreateGroupResponseDto> {
    const result = await this.createGroupUseCase.execute({
      name: request.name,
      memberNames: request.memberNames,
    });

    return {
      id: result.id,
      name: result.name,
      members: result.members,
      createdAt: result.createdAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group details' })
  @ApiParam({ name: 'id', description: 'Group ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Group details retrieved', type: GroupDetailsResponseDto })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async getGroupDetails(@Param('id') id: string): Promise<GroupDetailsResponseDto> {
    const result = await this.getGroupDetailsUseCase.execute({ groupId: id });

    return {
      id: result.id,
      name: result.name,
      members: result.members,
      memberCount: result.memberCount,
      createdAt: result.createdAt,
    };
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a member to a group' })
  @ApiParam({ name: 'id', description: 'Group ID (UUID)' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate member' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async addMember(@Param('id') groupId: string, @Body() request: AddMemberRequestDto) {
    const result = await this.addMemberToGroupUseCase.execute({
      groupId,
      memberName: request.memberName,
    });

    return {
      memberId: result.memberId,
      memberName: result.memberName,
      joinedAt: result.joinedAt,
    };
  }
}
