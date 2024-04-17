import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@app/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule, ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    GoogleOauthGuard,
    GoogleStrategy,
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}
