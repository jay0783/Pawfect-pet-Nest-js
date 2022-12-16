import { text } from 'express';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './customer';
import { EmployeeEntity } from './employee';

import { UserEntity } from './user/user.entity';

@Entity('NotificationFlags')
export class NotificationFlagEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: true })
  push!: boolean;

  @Column({ default: false })
  sms!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => CustomerEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'CASCADE',
  })
  customer!: Promise<CustomerEntity>;

  @ManyToOne((type) => EmployeeEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'CASCADE',
  })
  employee!: Promise<EmployeeEntity | null | undefined>;
}
