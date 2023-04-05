import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartItem } from '../../database/entities/cart-item.entity';

import { Cart } from '../../database/entities/cart.entity';
import { PurchasedProduct } from '../models';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_REPOSITORY')
    private cartRepository: Repository<Cart>,
  ) {}

  findByUserId(userId: string): Promise<Cart> {
    return this.cartRepository.findOneBy({ userId, status: 'OPEN' });
  }

  createByUserId(userId: string): Promise<Cart> {
    const cart = this.cartRepository.create({
      userId,
      items: [],
      status: 'OPEN',
    });
    return this.cartRepository.save(cart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    let userCart = await this.findByUserId(userId);
    if (userCart) {
      return userCart;
    }
    return await this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { product, count }: PurchasedProduct,
  ): Promise<Cart> {
    const cart: Cart = await this.findOrCreateByUserId(userId);
    const foundItem = cart.items.find((i) => i.productId === product.id);
    if (foundItem) {
      foundItem.count = count;
    } else {
      const newItem = new CartItem();
      newItem.cartId = cart.id;
      newItem.productId = product.id;
      newItem.count = count;
      cart.items.push(newItem);
    }
    cart.items = cart.items.filter((item) => item.count > 0);
    return this.cartRepository.save(cart);
  }

  async removeByUserId(userId): Promise<Cart> {
    const cart = await this.cartRepository.findOneBy({
      userId,
    });
    cart.status = 'ORDERED';
    return this.cartRepository.save(cart);
  }
}
