import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

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

  async updateUser(id: string, password: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { password },
      });

      return user;
    } catch {
      return null;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      return user;
    } catch {
      return null;
    }
  }
}
