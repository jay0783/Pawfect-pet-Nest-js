import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderPaymentStatusEnum } from './enums';
import { OrderEntity } from './index';

@Entity('OrderPayments')
export class OrderPaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: OrderPaymentStatusEnum,
    default: OrderPaymentStatusEnum.PENDING,
  })
  status!: OrderPaymentStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  reference!: string | null;

  @OneToOne((type) => OrderEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order!: Promise<OrderEntity>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
