import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { Tokens } from '../auth/entities/auth.entity';
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

  @Post('signup')
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, description: 'Invalid body request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

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
    const tokens = await this.authService.signin(dto);

    const updatedRes = this.setCookies(res, tokens);

    updatedRes.send();
  }

  @Post('reset')
  @ApiResponse({ status: 201, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid body request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  resetPassword(@Body() dto: PassResetDto) {
    // TO DO MAILER !!!
    return this.authService.resetPassword(dto);
  }

  @ApiResponse({
    status: 200,
    description:
      'Cookies Set: "auth" (required), "refresh" and "_auth-status" (optional).',
    headers: { ...descriptionHeaderCookies },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Get('refresh')
  async updateTokens(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.refreshTokens(req.cookies?.refresh);

    const updatedRes = this.setCookies(res, tokens);

    updatedRes.send();
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google OAuth',
  })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @ApiResponse({
    status: 302,
    description:
      'Redirect to client. Cookies Set: "auth", "refresh", "_auth-status" (all required)',
    headers: { ...descriptionHeaderCookies },
  })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.googleAuth(req?.user);

    const updatedRes = this.setCookies(res, tokens);

    updatedRes.redirect(this.clientUrl);
  }

  private setCookies(res: Response, tokens: Tokens) {
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

      res.cookie('_auth-status', true, {
        sameSite: 'strict',
        maxAge: tokens.refreshExpireTime,
      });
    }

    return res;
  }
}
