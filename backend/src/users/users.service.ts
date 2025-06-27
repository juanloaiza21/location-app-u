import { Injectable, ConflictException, NotFoundException, HttpException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {

  private logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(UsersService.name)
  }

  async createUser(data: UserDto): Promise<User> {
    try {
      data.password = this.createHash(data.password);
      return await this.prisma.user.create({
        data: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          password: data.password,
          email: data.email,
        }
      })
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Somenthing went wrong', 400)
    }
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: {
          phoneNumber: phone,
        }
      })
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Somenthing went wrong', 400);
    }
  }

  private createHash(data: string): string {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
  }

}
