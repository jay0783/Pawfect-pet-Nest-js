import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerEntity } from '../customer';
import { OrderEntity } from '../order';
import { EmployeeEntity } from './employee.entity';

@Entity('EmployeeRatings')
export class EmployeeRatingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float', default: 0 })
  rating!: number;

  @Column({ type: 'varchar', nullable: true })
  comment!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => EmployeeEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  employee!: Promise<EmployeeEntity>;

  @ManyToOne((type) => OrderEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  order!: Promise<OrderEntity | undefined>;

  @ManyToOne((type) => CustomerEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  customer!: Promise<CustomerEntity>;
}
