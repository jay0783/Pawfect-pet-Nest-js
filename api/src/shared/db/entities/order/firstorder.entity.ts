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
import { ExtraServiceEntity } from '../extra-service';
import { MainOrderEntity } from '../main-order';
import { OrderCheckEntity } from '../order-check';
import { ServiceEntity } from '../service';
import { UserEntity } from '../user';
import { OrderStatusEnum } from './enums';

@Entity('FreeOrders')
export class FreeOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  dateFrom!: Date;

  //1 :- for virtual
  //2:-  persion to persion
  @Column({ default: 0 })
  orderType!: number;

  //   @Column()
  //   dateTo!: Date;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
  })
  status!: OrderStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  comment!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => EmployeeEntity, { nullable: true, lazy: true })
  employee!: Promise<EmployeeEntity | null | undefined>;

  @ManyToOne((type) => ExtraServiceEntity, { nullable: false, lazy: true })
  extra!: Promise<ExtraServiceEntity>;

  @ManyToOne((type) => CustomerEntity, { nullable: true, lazy: true })
  customer!: Promise<CustomerEntity>;
}
