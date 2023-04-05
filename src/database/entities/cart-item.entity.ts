import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Cart } from './cart.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  cartId: string;

  @Column({ type: 'uuid', nullable: false })
  productId: string;

  @Column({ type: 'integer', nullable: false })
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { orphanedRowAction: 'delete' })
  cart: Cart;
}
