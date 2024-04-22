import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma/prisma.service';
import { SignupDto } from '../dto/signup.dto';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: SignupDto) {
    try {
      const user = await this.prisma.user.create({ data: { ...dto } });

      return user;
    } catch {
      return null;
    }
  }

  async findUserById(userId: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      return user;
    } catch {
      return null;
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
      });

      return user;
    } catch {
      return null;
    }
  }
}
