import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { OrderStatusEnum } from '@pawfect/db/entities/enums';
import { OrderRepository } from '@pawfect/db/repositories';
import { IsNull } from 'typeorm';

@Injectable()
export class CronService {
  constructor(private readonly orderRepository: OrderRepository) {}
  @Cron('* * * * * *')
  async runEverySecond() {
    const order = await this.orderRepository.find({
      where: {
        status: OrderStatusEnum.PENDING,
        employee: null,
      },
    });

    //Order Time check For Admin
    for (let i = 0; i < order.length; i++) {
      if (
        order[i].dateFrom.getTime() / 1000 ==
        Math.floor(new Date().getTime() / 1000)
      ) {
        order[i].reasonForCancel = 'Order Canceled!';

        order[i].status = OrderStatusEnum.CANCELED;
        await this.orderRepository.save(order[i]);
      }
    }

    const orderEmployee = await this.orderRepository.find({
      where: {
        status: OrderStatusEnum.PENDING,
        isEmployeeAccepted: false,
      },
      relations: ['employee'],
    });

    //Order Time check For Admin
    for (let i = 0; i < orderEmployee.length; i++) {
      if (await orderEmployee[i].employee) {
        if (
          orderEmployee[i].dateFrom.getTime() / 1000 ==
            Math.floor(new Date().getTime() / 1000) &&
          orderEmployee[i].isEmployeeAccepted === false
        ) {
          console.log('-----cron run-----');

          orderEmployee[i].reasonForCancel = 'Order Canceled!';

          orderEmployee[i].status = OrderStatusEnum.CANCELED;
          await this.orderRepository.save(orderEmployee[i]);
        }
      }
    }
  }

  //   @Cron(CronExpression.EVERY_MINUTE)
  //   runEveryMinute() {
  //     console.log('Every minute');
  //   }

  //   @Timeout(15000)
  //   onceAfter15Seconds() {
  //     console.log('Called once after 15 seconds');
  //   }
}
