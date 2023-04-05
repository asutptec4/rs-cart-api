import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { cartProviders } from '../database/entities.providers';
import { CartController } from './cart.controller';
import { CartService } from './services';

@Module({
  imports: [DatabaseModule],
  providers: [...cartProviders, CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
