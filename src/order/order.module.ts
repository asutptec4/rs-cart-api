import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { cartProviders, orderProviders } from '../database/entities.providers';
import { OrderController } from './order.controller';
import { OrderService } from './services';

@Module({
  imports: [DatabaseModule],
  providers: [...cartProviders, ...orderProviders, OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
