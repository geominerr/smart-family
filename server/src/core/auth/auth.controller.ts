import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Res,
  Patch,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { SkipAuth } from './decorators/skip-auth-guard.decorator';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { AuthData } from '../auth/entities/auth.entity';
import { SignupDto } from '../auth/dto/signup.dto';
import { SigninDto } from '../auth/dto/signin.dto';
import { PassResetDto } from '../auth/dto/pass-reset.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { descriptionHeaderCookies } from './entities/headers.description';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  private readonly clientUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.clientUrl =
      this.configService.get('GOOGLE_CONFIG').REDIRECT_CLIENT_URL;
  }

  @SkipAuth()
  @Post('signup')
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, description: 'Invalid body request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @SkipAuth()
  @Post('signin')
  @ApiResponse({
    status: 201,
    description:
      'Cookies Set: "auth", "refresh", "_auth-status" (all required)',
    headers: { ...descriptionHeaderCookies },
  })
  @ApiResponse({ status: 400, description: 'Invalid body request' })
  @ApiResponse({ status: 403, description: 'Incorrect password' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async signin(@Body() dto: SigninDto, @Res() res: Response) {
    const authData = await this.authService.signin(dto);

    const updatedRes = this.setCookies(res, { ...authData });

    updatedRes.send();
  }

  @SkipAuth()
  @Patch('logout')
  @ApiResponse({ status: 204, description: 'Remove cookies' })
  async logout(@Req() req, @Res() res: Response) {
    ['_auth-status', 'auth', 'refresh'].forEach((cookie) =>
      res.clearCookie(cookie),
    );

    res.status(204).send();
  }

  @SkipAuth()
  @Post('reset')
  @ApiResponse({ status: 201, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid body request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  resetPassword(@Body() dto: PassResetDto) {
    // TO DO MAILER !!!
    return this.authService.resetPassword(dto);
  }

  @SkipAuth()
  @Post('refresh')
  @ApiResponse({
    status: 201,
    description: 'Cookies Set: "auth" (required)',
    headers: { 'Set-cookie': { ...descriptionHeaderCookies['Set-Cookie-1'] } },
  })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateTokens(@Req() req, @Res() res: Response) {
    const { accessToken, expireTime } = await this.authService.refreshTokens(
      req.cookies?.refresh,
    );

    res.cookie('auth', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: expireTime,
    });

    res.send();
  }

  @SkipAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth',
  })
  googleAuth() {}

  @SkipAuth()
  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  @ApiResponse({
    status: 302,
    description:
      'Redirect to client. Cookies Set: "auth", "refresh", "_auth-status" (all required)',
    headers: { ...descriptionHeaderCookies },
  })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const authData = await this.authService.googleAuth(req?.user);

    const updatedRes = this.setCookies(res, { ...authData });

    updatedRes.redirect(this.clientUrl);
  }

  private setCookies(res: Response, authData: AuthData) {
    const { userId, tokens } = authData;

    res.cookie('auth', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: tokens.expireTime,
    });

    if (tokens?.refreshToken && tokens?.refreshExpireTime) {
      res.cookie('refresh', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: tokens.refreshExpireTime,
      });

      res.cookie('_auth-status', userId, {
        sameSite: 'strict',
        maxAge: tokens.refreshExpireTime,
      });
    }

    return res;
  }
}
