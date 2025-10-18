import { Controller, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BalanceResponseDto } from '../dto/balance.response.dto';
import { CalculateGroupBalancesUseCase } from '../../application/use-cases/calculate-group-balances.use-case';
import { GetMemberBalanceUseCase } from '../../application/use-cases/get-member-balance.use-case';

@ApiTags('Balances')
@Controller('groups/:groupId/balances')
export class BalanceController {
  constructor(
    private readonly calculateGroupBalancesUseCase: CalculateGroupBalancesUseCase,
    private readonly getMemberBalanceUseCase: GetMemberBalanceUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get cached balances for all members in a group' })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Balances retrieved', type: BalanceResponseDto })
  @ApiResponse({ status: 404, description: 'Balances not calculated yet' })
  async getGroupBalances(@Param('groupId') groupId: string): Promise<BalanceResponseDto> {
    // This would call a use case that just reads the cached balance
    // For now, we'll trigger calculation
    const result = await this.calculateGroupBalancesUseCase.execute({ groupId });

    return {
      groupId: result.groupId,
      memberBalances: result.memberBalances,
      lastCalculatedAt: result.lastCalculatedAt,
    };
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recalculate balances for all members' })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Balances recalculated', type: BalanceResponseDto })
  async calculateBalances(@Param('groupId') groupId: string): Promise<BalanceResponseDto> {
    const result = await this.calculateGroupBalancesUseCase.execute({ groupId });

    return {
      groupId: result.groupId,
      memberBalances: result.memberBalances,
      lastCalculatedAt: result.lastCalculatedAt,
    };
  }

  @Get('members/:memberId')
  @ApiOperation({ summary: 'Get balance for a specific member' })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiParam({ name: 'memberId', description: 'Member ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Member balance retrieved' })
  @ApiResponse({ status: 404, description: 'Balance not found' })
  async getMemberBalance(@Param('groupId') groupId: string, @Param('memberId') memberId: string) {
    const result = await this.getMemberBalanceUseCase.execute({ groupId, memberId });

    return {
      memberId: result.memberId,
      balanceInCents: result.balanceInCents,
      isPositive: result.isPositive,
      lastCalculatedAt: result.lastCalculatedAt,
    };
  }
}
