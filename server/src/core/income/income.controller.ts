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

import { IncomeService } from './income.service';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@ApiTags('income')
@ApiCookieAuth()
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @ApiResponse({ status: 201, type: Income })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  create(@Body() createincomeDto: CreateIncomeDto, @Req() req) {
    const { sub } = req?.user;

    return this.incomeService.create(createincomeDto, sub);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Income })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { sub } = req?.user;

    return this.incomeService.findOne(id, sub);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Income })
  @ApiResponse({ status: 400, description: 'Invalid UUID | Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateincomeDto: UpdateIncomeDto,
    @Req() req,
  ) {
    const { sub } = req?.user;

    return this.incomeService.update(id, updateincomeDto, sub);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'income deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Income not found' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { sub } = req?.user;

    return this.incomeService.remove(id, sub);
  }
}
