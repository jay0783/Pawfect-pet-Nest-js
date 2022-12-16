import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CustomerBankCardEntity,
  CustomerEntity,
  MainOrderEntity,
  OrderEntity,
  OrderPaymentEntity,
  UserEntity,
} from '@pawfect/db/entities';
import { OrderPaymentStatusEnum } from '@pawfect/db/entities/enums';
import {
  CardRepository,
  OrderRepository,
  PaymentRepository,
} from '@pawfect/db/repositories';
import { SuccessModel } from '@pawfect/models';
const crypto = require('crypto');
const axios = require('axios');

@Injectable()
export class PaymentService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly cardRepository: CardRepository,
  ) {}

  async chargeOrder(orderId: string): Promise<Boolean> {
    const orderEntity:
      | OrderEntity
      | undefined = await this.orderRepository.findOne(orderId);
    if (!orderEntity) {
      // throw new NotFoundException('Order not found !');
      return false;
    }
    //Getting required order, customer data
    const orderPaymentEntity: OrderPaymentEntity = await orderEntity.orderPayments;
    const mainOrderEntity: MainOrderEntity = await orderEntity.mainOrder;
    const customerEntity: CustomerEntity = await mainOrderEntity.customer;
    const cardEntity:
      | CustomerBankCardEntity
      | undefined = await this.cardRepository.findOne({
      where: { customer: customerEntity.id },
    });
    const userEntity: UserEntity = await customerEntity.user;

    //final price after discount
    const amountAfterDiscount =
      orderEntity.priceWithExtras - orderEntity.discount;

    //Generating request body for paya API
    let chargeDetails = {
      eCommerce: {
        amounts: {
          total: amountAfterDiscount,
        },
        orderNumber: orderEntity.id,
        customer: {
          email: userEntity.email,
          telephone: customerEntity.phoneNumber,
        },
        billing: {
          name: customerEntity.name,
          address: customerEntity.address,
          city: customerEntity.city,
          state: customerEntity.state,
        },
      },
      vault: {
        token: cardEntity!.token,
        // token: 'f2d1c89ffea3456082acb4f87481312e',
        operation: 'Read',
      },
    };

    //setting required headers as per the https://developer.sagepayments.com/apis
    let merchantId = process.env.MERCHANTID;
    let nonce = crypto.randomBytes(12).toString('base64');
    let timestamp = Math.floor(new Date().getTime() / 1000);
    let verb = 'POST';
    let requestBody = JSON.stringify(chargeDetails);
    let url = 'https://api-cert.sagepayments.com/bankcard/v1/charges?type=Sale';
    let hash_str = verb + url + requestBody + merchantId + nonce + timestamp;
    const hmac1 = crypto
      .createHmac('sha512', process.env.CLIENTKEY)
      .update(hash_str)
      .digest();
    let auth = Buffer.from(hmac1).toString('base64');
    const headers = {
      clientId: process.env.CLIENTID,
      merchantId: process.env.MERCHANTID,
      merchantKey: process.env.MERCHANTKEY,
      nonce: nonce,
      timestamp: timestamp,
      Authorization: auth,
      'Content-Type': 'application/json',
    };

    let res;
    try {
      res = await axios({
        method: verb,
        url: url,
        headers: headers,
        data: requestBody,
      });
    } catch (err: any) {
      console.error(err.response.data.detail);
      return false;
    }

    //updating payment status on successful payment
    orderPaymentEntity.status = OrderPaymentStatusEnum.PAID;
    orderPaymentEntity.reference = res.data.reference;
    await this.paymentRepository.save(orderPaymentEntity);
    return true;
  }
}
