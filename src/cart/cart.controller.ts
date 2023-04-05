import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AppRequest, getUserIdFromRequest } from '../shared';
import { PurchasedProduct } from './models';
import { CartService } from './services';
import { BasicAuthGuard } from '../auth';

@Controller('profile/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<any> {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User ID is not provided',
      };
    }
    const cart = await this.cartService.findOrCreateByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: cart.items,
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: PurchasedProduct,
  ): Promise<any> {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User ID is not provided',
      };
    }
    const cart = await this.cartService.updateByUserId(userId, body);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: {
        cart,
      },
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest): Promise<any> {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body): Promise<any> {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const { id: cartId, items } = cart;
    // const order = this.orderService.create({
    //   ...body, // TODO: validate and pick only necessary data
    //   userId,
    //   cartId,
    //   items,
    // });
    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      // result: { order },
    };
  }
}
