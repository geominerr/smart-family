import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

import { IJwtConfig } from '@app/config/config.model';
import { AuthRepository } from './repository/auth.repository';
import { converteTimeToMilliseconds } from './utils/time-converter.util';
import { AuthData } from './entities/auth.entity';
import { User } from './entities/user.entity';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { PassResetDto } from './dto/pass-reset.dto';
import {
  IncorrectPasswordException,
  RefreshTokenNotFoundException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions/http.exception';

@Injectable()
export class AuthService {
  private readonly jwtConfig: IJwtConfig;

  constructor(
    private configService: ConfigService,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {
    this.jwtConfig = this.configService.get<IJwtConfig>('JWT_CONFIG');
  }

  async signup(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, this.jwtConfig.CRYPT_SALT);

    const isUserExists = await this.authRepository.findUserByEmail(dto.email);

    if (isUserExists) {
      throw new UserAlreadyExistsException();
    }

    const user = await this.authRepository.createUser({
      ...dto,
      password: hash,
    });

    return plainToInstance(User, user);
  }

  async signin(dto: SigninDto): Promise<AuthData> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new IncorrectPasswordException();
    }

    const tokens = await this.getJwtTokens(user);

    return { userId: user.id, tokens: { ...tokens } };
  }

  async googleAuth(dto: GoogleAuthDto): Promise<AuthData> {
    let user = await this.authRepository.findUserByEmail(dto.email);

    if (user) {
      const tokens = await this.getJwtTokens(user);

      return { userId: user.id, tokens: { ...tokens } };
    }

    const { email, username } = dto;
    const password = await bcrypt.hash(randomUUID(), this.jwtConfig.CRYPT_SALT);

    user = await this.authRepository.createUser({
      password,
      email,
      username,
    });

    const tokens = await this.getJwtTokens(user);

    return { userId: user.id, tokens: { ...tokens } };
  }

  async resetPassword(dto: PassResetDto) {
    // TO DO MAILER !!!
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return { message: 'success' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new RefreshTokenNotFoundException();
      }

      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.JWT_SECRET_REFRESH_KEY,
      });
      const user = await this.authRepository.findUserById(decodedToken.sub);

      if (!user) {
        throw new UserNotFoundException();
      }

      return await this.getAccessToken(user);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
    }
  }

  private async getJwtTokens(user: User) {
    const { jwtService } = this;
    const {
      JWT_SECRET_KEY,
      TOKEN_EXPIRE_TIME,
      JWT_SECRET_REFRESH_KEY,
      TOKEN_REFRESH_EXPIRE_TIME,
    } = this.jwtConfig;

    const payload = { sub: user.id, useranme: user.username };

    const [accessToken, refreshToken] = await Promise.all([
      jwtService.signAsync(payload, {
        secret: JWT_SECRET_KEY,
        expiresIn: TOKEN_EXPIRE_TIME,
      }),
      jwtService.signAsync(payload, {
        secret: JWT_SECRET_REFRESH_KEY,
        expiresIn: TOKEN_REFRESH_EXPIRE_TIME,
      }),
    ]);

    const [expireTime, refreshExpireTime] = [
      TOKEN_EXPIRE_TIME,
      TOKEN_REFRESH_EXPIRE_TIME,
    ].map((time) => converteTimeToMilliseconds(time));

    return { accessToken, refreshToken, expireTime, refreshExpireTime };
  }

  private async getAccessToken(user: User) {
    const { jwtService } = this;
    const { JWT_SECRET_KEY, TOKEN_EXPIRE_TIME } = this.jwtConfig;

    const payload = { sub: user.id, useranme: user.username };

    const accessToken = await jwtService.signAsync(payload, {
      secret: JWT_SECRET_KEY,
      expiresIn: TOKEN_EXPIRE_TIME,
    });

    const expireTime = converteTimeToMilliseconds(TOKEN_EXPIRE_TIME);

    return { accessToken, expireTime };
  }
}
