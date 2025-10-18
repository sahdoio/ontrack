import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecordExpenseRequestDto } from '../dto/record-expense.request.dto';
import { RecordExpenseResponseDto } from '../dto/record-expense.response.dto';
import { ListExpensesResponseDto } from '../dto/list-expenses.response.dto';
import { RecordExpenseUseCase } from '../../application/use-cases/record-expense.use-case';
import { ListGroupExpensesUseCase } from '../../application/use-cases/list-group-expenses.use-case';

@ApiTags('Expenses')
@Controller('groups/:groupId/expenses')
export class ExpenseController {
  constructor(
    private readonly recordExpenseUseCase: RecordExpenseUseCase,
    private readonly listGroupExpensesUseCase: ListGroupExpensesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new expense' })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiResponse({ status: 201, description: 'Expense recorded successfully', type: RecordExpenseResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async recordExpense(
    @Param('groupId') groupId: string,
    @Body() request: RecordExpenseRequestDto,
  ): Promise<RecordExpenseResponseDto> {
    const result = await this.recordExpenseUseCase.execute({
      groupId,
      payerId: request.payerId,
      name: request.name,
      amountInCents: request.amountInCents,
      splitEqually: request.splitEqually,
      customSplits: request.customSplits,
    });

    return {
      id: result.id,
      groupId: result.groupId,
      payerId: result.payerId,
      name: result.name,
      amountInCents: result.amountInCents,
      splits: result.splits,
      createdAt: result.createdAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all expenses for a group' })
  @ApiParam({ name: 'groupId', description: 'Group ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Expenses retrieved', type: ListExpensesResponseDto })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async listExpenses(@Param('groupId') groupId: string): Promise<ListExpensesResponseDto> {
    const result = await this.listGroupExpensesUseCase.execute({ groupId });

    return {
      expenses: result.expenses,
      totalCount: result.totalCount,
      totalAmountInCents: result.totalAmountInCents,
    };
  }
}
