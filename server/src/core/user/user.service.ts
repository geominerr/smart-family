import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { IJwtConfig } from '@app/config/config.model';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Payload } from './models/payload.model';
import { UserRepository } from './repository/user.repository';
import {
  IncorrectPasswordException,
  InsufficientPermissionsException,
  UserNotFoundException,
} from './exceptions/http.exception';

@Injectable()
export class UserService {
  private cryptSalt: number;

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.cryptSalt =
      this.configService.get<IJwtConfig>('JWT_CONFIG').CRYPT_SALT;
  }

  async findOne(id: string, payload: Payload) {
    const user = await this.getUserOrException(id, payload);

    return plainToInstance(User, user);
  }

  async updateUser(id: string, dto: UpdatePasswordDto, payload: Payload) {
    const user = await this.getUserOrException(id, payload);
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);

    if (!isMatch) {
      throw new IncorrectPasswordException();
    }

    const hash = await bcrypt.hash(dto.newPassword, this.cryptSalt);
    const updateUser = await this.userRepository.updateUser(id, hash);

    return plainToInstance(User, updateUser);
  }

  async removeUser(id: string, payload: Payload) {
    await this.getUserOrException(id, payload);
    await this.userRepository.deleteUser(id);

    return;
  }

  private async getUserOrException(id: string, payload: Payload) {
    const { sub } = payload;

    if (sub !== id) {
      throw new InsufficientPermissionsException();
    }

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
