import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Decimal from 'decimal.js';

import { OrderCancellationEnum } from './enums';
import { OrderEntity } from './order.entity';

@Entity('OrderCancellations')
export class OrderCancellationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  reason?: string | null;

  @Column({
    type: 'enum',
    enum: OrderCancellationEnum,
  })
  type!: OrderCancellationEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => OrderEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order!: Promise<OrderEntity>;

  @Column({ default: 0 })
  status!: number;

  get maxRefundAmount(): Promise<Decimal> {
    return this.order.then((orderEntity) => {
      return new Decimal(orderEntity.priceWithExtras).minus(
        new Decimal(orderEntity.priceWithExtras).mul(0.15),
      );
    });
  }
}
