import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { userProviders } from '../database/entities.providers';
import { UsersService } from './services';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
