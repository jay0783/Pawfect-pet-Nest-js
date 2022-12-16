import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaginationRequest, SuccessModel } from '@pawfect/models';
import { ChargeOrderRequest } from './models';

@ApiBearerAuth()
@ApiTags('Payment')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('charge')
  async chargeOrder(
    @Body() chargeOrderRequest: ChargeOrderRequest,
  ): Promise<SuccessModel> {
    const { orderIds } = chargeOrderRequest;
    if (!orderIds || !orderIds.length) {
      throw new BadRequestException('Please select atleast one order');
    }

    const paymentStatus: Array<Boolean> = new Array<Boolean>();
    //charging multiple orders
    for (const orderId of orderIds) {
      const orderPaid: Boolean = await this.paymentService.chargeOrder(orderId);
      paymentStatus.push(orderPaid);
    }

    //checking if all orders were successfully charged
    const allOrdersPaymentSuccessfull: Boolean = paymentStatus.every(Boolean);
    if (!allOrdersPaymentSuccessfull) {
      throw new InternalServerErrorException(
        'Some orders were not charged successfully',
      );
    }
    return new SuccessModel();
  }
}
