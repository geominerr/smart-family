import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '@app/prisma/prisma.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ConfigService],
})
export class UserModule {}
