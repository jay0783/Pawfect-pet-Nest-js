import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { CustomerEntity } from "./customer.entity";
import { HearAboutUsEnum } from "./enums";


@Entity("CustomerComings")
export class CustomerComingEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: HearAboutUsEnum
  })
  hearAboutUs!: HearAboutUsEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(type => CustomerEntity, { nullable: false, lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  customer!: Promise<CustomerEntity>;
}
