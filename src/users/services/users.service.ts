import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  findOne(name: string): Promise<User> {
    return this.userRepository.findOne({ where: { name: name }});
  }

  createOne({
    name,
    password,
  }: {
    name: string;
    password: string;
  }): Promise<User> {
    const user = this.userRepository.create({ name, password });
    return this.userRepository.save(user);
  }
}
