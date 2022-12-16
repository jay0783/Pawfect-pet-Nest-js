import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MainOrderEntity } from './main-order.entity';

@Entity('MainOrderDays')
export class MainOrderDayEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float', default: 0 })
  price!: number;

  @Column()
  dateFrom!: Date;

  @Column()
  dateTo!: Date;

  @Column({ default: false })
  isHoliday!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => MainOrderEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  mainOrder!: Promise<MainOrderEntity>;
}
