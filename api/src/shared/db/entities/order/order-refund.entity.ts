import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerEntity, CustomerTransactionsEntity } from '../customer';
import { OrderEntity } from './order.entity';

@Entity('OrderRefunds')
export class OrderRefundEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float', default: 0 })
  amount!: number;

  @Column({ default: 0 })
  type!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => OrderEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  order!: Promise<OrderEntity | null>;

  // @ManyToOne(type => CustomerTransactionsEntity, { nullable: true, lazy: true, onDelete: "SET NULL", onUpdate: 'CASCADE' })
  // transaction!: Promise<CustomerTransactionsEntity | undefined>;

  @ManyToOne((type) => CustomerEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  customer!: Promise<CustomerEntity | null>;
}
