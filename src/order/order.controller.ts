import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { AppRequest, getUserIdFromRequest } from '../shared';
import {
  CreateOrderDto,
  StatusUpdateDto,
  mapOrderToGetOrderDto,
} from './models';
import { OrderService } from './services/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @UseGuards(BasicAuthGuard)
  @Put()
  async create(
    @Req() req: AppRequest,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<any> {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User ID is not provided',
      };
    }
    const order = await this.ordersService.create(createOrderDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: order,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async findAll(@Req() req: AppRequest): Promise<any> {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User ID is not provided',
      };
    }
    const orders = await this.ordersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: orders.map((o) => mapOrderToGetOrderDto(o)),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const order = await this.ordersService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: mapOrderToGetOrderDto(order),
    };
  }

  @Put(':id/status')
  async update(
    @Param('id') id: string,
    @Body() status: StatusUpdateDto,
  ): Promise<any> {
    const order = await this.ordersService.updateStatus(id, status);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: order,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    try {
      await this.ordersService.remove(id);
      return {
        statusCode: HttpStatus.NO_CONTENT,
      };
    } catch (e) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }
}
