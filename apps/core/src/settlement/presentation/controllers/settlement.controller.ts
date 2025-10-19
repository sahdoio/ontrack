import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecordSettlementRequestDto } from '../dto/record-settlement.request.dto';
import {
  SettlementResponseDto,
  ListSettlementsResponseDto,
} from '../dto/settlement.response.dto';
import { RecordSettlementUseCase } from '../../application/use-cases/record-settlement.use-case';
import { ListSettlementsUseCase } from '../../application/use-cases/list-settlements.use-case';

@ApiTags('Settlements')
@Controller('groups/:groupId/settlements')
export class SettlementController {
  constructor(
    private readonly recordSettlementUseCase: RecordSettlementUseCase,
    private readonly listSettlementsUseCase: ListSettlementsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record a debt settlement (payment between members)',
  })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiResponse({
    status: 201,
    description: 'Settlement recorded successfully',
    type: SettlementResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input (e.g., payer = receiver)',
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async recordSettlement(
    @Param('groupId') groupId: string,
    @Body() request: RecordSettlementRequestDto,
  ): Promise<SettlementResponseDto> {
    const result = await this.recordSettlementUseCase.execute({
      groupId,
      payerId: request.payerId,
      receiverId: request.receiverId,
      amountInCents: request.amountInCents,
    });

    return {
      id: result.id,
      groupId: result.groupId,
      payerId: result.payerId,
      receiverId: result.receiverId,
      amountInCents: result.amountInCents,
      createdAt: result.createdAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all settlements for a group' })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Settlements retrieved',
    type: ListSettlementsResponseDto,
  })
  async listSettlements(
    @Param('groupId') groupId: string,
  ): Promise<ListSettlementsResponseDto> {
    const result = await this.listSettlementsUseCase.execute({ groupId });

    return {
      settlements: result.settlements,
      totalCount: result.totalCount,
    };
  }
}
