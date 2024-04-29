import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../auth/auth.guard';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { CreateOrderDto, findAllOrderDto } from './order.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('tambah')
  async createOrder(@InjectCreatedBy() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }

  @Get('list')
  async listOrder(@Pagination() query: findAllOrderDto) {
    return this.orderService.findAll(query);
  }
}
