import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Body,
  ParseUUIDPipe,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('User')
@ApiCookieAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiResponse({ status: 20, type: User })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const { user } = req;

    return this.userService.findOne(id, user);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 400, description: 'Invalid UUID or Invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions or Invalid password',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePasswordDto,
    @Req() req,
  ) {
    const { user } = req;

    return this.userService.updateUser(id, dto, user);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully. Remove cookies',
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
    @Res() res: Response,
  ) {
    const { user } = req;

    await this.userService.removeUser(id, user);

    ['_auth-status', 'auth', 'refresh'].forEach((cookie) =>
      res.clearCookie(cookie),
    );

    res.status(204).send();
  }
}
