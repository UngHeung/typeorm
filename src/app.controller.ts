import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  @Post('users')
  createUser() {
    return this.userRepository.save({
      title: 'test title',
    });
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find();
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
    });
    console.log(user);
    return this.userRepository.save({
      ...user,
      title: `${user.title}0`,
    });
  }
}
