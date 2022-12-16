import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from '../customer';

import { EmployeeEntity } from '../employee';
import { MainOrderEntity } from '../main-order';
import { OrderCheckEntity } from '../order-check';
import { ServiceEntity } from '../service';
import { UserEntity } from '../user';
import { OrderPaymentEntity } from './order-payment.entity';
import { OrderStatusEnum } from './enums';

@Entity('Orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: false })
  isEmployeeAccepted!: boolean;

  @Column({ default: false })
  isFirstMeeting!: boolean;

  @Column()
  dateFrom!: Date;

  @Column()
  dateTo!: Date;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
  })
  status!: OrderStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  comment!: string | null;

  @Column({ unsigned: true, type: 'float', default: 0 })
  discount!: number;

  @Column({ unsigned: true, type: 'float', default: 1 })
  priceWithExtras!: number;

  @Column({ unsigned: true })
  holidayFeePrice!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => EmployeeEntity, { nullable: true, lazy: true })
  employee!: Promise<EmployeeEntity | null | undefined>;

  @ManyToOne((type) => ServiceEntity, { nullable: true, lazy: true })
  service!: Promise<ServiceEntity>;

  @ManyToOne((type) => MainOrderEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  mainOrder!: Promise<MainOrderEntity>;

  @OneToMany((type) => OrderCheckEntity, (check) => check.order, { lazy: true })
  orderChecks!: Promise<Array<OrderCheckEntity>>;

  @OneToOne(
    (type) => OrderPaymentEntity,
    (orderPayment) => orderPayment.order,
    {
      nullable: false,
      lazy: true,
    },
  )
  orderPayments: Promise<OrderPaymentEntity>;

  @Column({ default: null })
  reasonForCancel!: string;
}
