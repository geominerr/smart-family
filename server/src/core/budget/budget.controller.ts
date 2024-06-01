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

import {
  Budget,
  BudgetWithoutIncomeAndExpenses,
} from './entities/budget.entity';
import { CreateDemoBudgetDto } from './dto/create-demo-budget.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetService } from './budget.service';

@ApiTags('Budget')
@ApiCookieAuth()
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('demo')
  @ApiResponse({ status: 201, type: Budget })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  createDemo(@Body() dto: CreateDemoBudgetDto, @Req() req) {
    const { sub } = req?.user;

    return this.budgetService.createDemoBudget(dto, sub);
  }

  @Post()
  @ApiResponse({ status: 201, type: BudgetWithoutIncomeAndExpenses })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  create(@Body() createBudgetDto: CreateBudgetDto, @Req() req) {
    const { sub } = req?.user;

    return this.budgetService.create(createBudgetDto, sub);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Budget })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { sub } = req?.user;

    return this.budgetService.findOne(id, sub);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Budget })
  @ApiResponse({ status: 400, description: 'Invalid UUID | Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Req() req,
  ) {
    const { sub } = req?.user;

    return this.budgetService.update(id, updateBudgetDto, sub);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Budget deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Budget not found' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { sub } = req?.user;

    return this.budgetService.remove(id, sub);
  }
}
