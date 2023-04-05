import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Cart } from './cart.entity';
import { User } from './user.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid', nullable: false })
  cartId: string;

  @OneToOne(() => Cart, { eager: true })
  @JoinColumn()
  cart: Cart;

  @Column({ type: 'json' })
  payment: any;

  @Column({ type: 'json' })
  delivery: any;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ['OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED'],
  })
  status: string;

  @Column({ type: 'float', nullable: false })
  total: number;
}
