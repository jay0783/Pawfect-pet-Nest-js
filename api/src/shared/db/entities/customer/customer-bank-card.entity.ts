import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('CustomerBankCards')
export class CustomerBankCardEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  fourDigits!: string;

  @Column()
  token!: string;

  @Column({ default: false })
  isChosen!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => CustomerEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  customer!: Promise<CustomerEntity>;

  @Column({ nullable: true })
  cvc!: string;

  @Column({ nullable: true })
  expiry!: string;
}
