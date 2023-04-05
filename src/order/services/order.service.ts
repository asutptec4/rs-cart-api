import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Cart, Order } from '../../database/entities';
import { CreateOrderDto, StatusUpdateDto } from '../models';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
    @Inject('CART_REPOSITORY')
    private cartRepository: Repository<Cart>,
  ) {}

  findById(orderId: string): Promise<Order> {
    return this.orderRepository.findOneBy({ id: orderId });
  }

  async create(data: CreateOrderDto, userId: string): Promise<Order> {
    let savedOrder;
    await this.orderRepository.manager.transaction(async (transactionManager) => {
      const cart = await this.cartRepository.findOneBy({
        userId,
        status: 'OPEN',
      });
      const order = this.orderRepository.create({
        userId,
        cartId: cart.id,
        payment: {},
        delivery: data.address,
        status: 'OPEN',
        total: data.items.reduce(
          (acc, item) => (acc += item.count * item.price),
          0,
        ),
      });
      cart.status = 'ORDERED';
      await transactionManager.save(cart);
      savedOrder = await transactionManager.save(order);
    });
    return savedOrder;
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async updateStatus(id: string, status: StatusUpdateDto): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    order.status = status.status;
    return this.orderRepository.save(order);
  }

  remove(id: string): Promise<any> {
    return this.orderRepository.delete({ id });
  }
}
