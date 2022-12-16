import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { OrderCheckEntity } from "./order-check.entity";


@Entity("OrderCheckActions")
export class OrderCheckActionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  time!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(type => OrderCheckEntity, { nullable: false, lazy: true, onDelete: "CASCADE", onUpdate: 'CASCADE' })
  orderCheck!: Promise<OrderCheckEntity>;
}
