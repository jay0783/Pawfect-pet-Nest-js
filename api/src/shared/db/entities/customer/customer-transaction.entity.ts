import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerTransactionEnum } from './enums';
import { CustomerBankCardEntity } from './customer-bank-card.entity';
import { CustomerEntity } from './customer.entity';
import { PetEntity } from '../pet/pet.entity';
@Entity('CustomerTransactions')
export class CustomerTransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  amount!: number;

  @Column({
    type: 'enum',
    enum: CustomerTransactionEnum,
  })
  type!: CustomerTransactionEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // @ManyToOne((type) => CustomerBankCardEntity, {
  //   nullable: true,
  //   lazy: true,
  //   onDelete: 'CASCADE',
  // })
  // card!: Promise<CustomerBankCardEntity>;

  // @Column('uuid')
  // pet!: string;

  @ManyToOne((type) => PetEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'CASCADE',
  })
  pet!: Promise<PetEntity>;

  @ManyToOne((type) => CustomerEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  customer!: Promise<CustomerEntity>;
}
