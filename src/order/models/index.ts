import { Order } from '../../database/entities';

export type CreateOrderDto = {
  address: {
    address: string;
    comment: string;
    firstName: string;
    lastName: string;
  };
  items: {
    count: number;
    productId: string;
    price: number;
  }[];
};

export type GetOrderDto = {
  id: string;
  address: {
    address: string;
    comment: string;
    firstName: string;
    lastName: string;
  };
  items: {
    count: number;
    productId: string;
  }[];
  statusHistory: { status: string; timestamp: Date; comment: string }[];
};

export type StatusUpdateDto = {
  comment: string;
  status: string;
};

export const mapOrderToGetOrderDto = (order: Order): GetOrderDto => {
  return {
    id: order.id,
    address: order.delivery,
    items: order.cart.items,
    statusHistory: [
      {
        status: order.status,
        timestamp: order.cart.updatedAt,
        comment: order.delivery.comment,
      },
    ],
  };
};
