import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from '../order';
import { EmployeeEntity } from './employee.entity';

@Entity('EmployeePayrolls')
export class EmployeePayrollEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'float', default: 5 })
  empJobRate!: number;

  @ManyToOne((type) => EmployeeEntity, { nullable: false, lazy: true })
  employee!: Promise<EmployeeEntity>;

  @ManyToOne((type) => OrderEntity, { nullable: false, lazy: true })
  order!: Promise<OrderEntity>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
