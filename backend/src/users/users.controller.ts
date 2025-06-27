import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(private readonly userService: UsersService) { }

  @Get('/get/:phone')
  async findByPhone(@Param('phone') phone: string, @Req() req: Request) {
    return await this.userService.getUserByPhone(phone);
  }

}
