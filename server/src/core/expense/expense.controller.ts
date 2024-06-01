import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  HttpCode,
} from '@nestjs/common';

import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ExpenseService } from './expense.service';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@ApiTags('Expense')
@ApiCookieAuth()
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiResponse({ status: 201, type: Expense })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req) {
    const { sub } = req?.user;

    return this.expenseService.create(createExpenseDto, sub);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Expense })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { sub } = req?.user;

    return this.expenseService.findOne(id, sub);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Expense })
  @ApiResponse({ status: 400, description: 'Invalid UUID | Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req,
  ) {
    const { sub } = req?.user;

    return this.expenseService.update(id, updateExpenseDto, sub);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { sub } = req?.user;

    return this.expenseService.remove(id, sub);
  }
}
