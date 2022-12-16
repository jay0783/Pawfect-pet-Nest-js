import {
  CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { PhotoEntity } from "../photo.entity";
import { OrderCheckEntity } from "./order-check.entity";


@Entity("OrderCheckAttachments")
export class OrderCheckAttachmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(type => OrderCheckEntity, { nullable: false, lazy: true, onDelete: "CASCADE", onUpdate: 'CASCADE' })
  orderCheck!: Promise<OrderCheckEntity>;

  @ManyToOne(type => PhotoEntity, { nullable: true, lazy: true, onDelete: "SET NULL", onUpdate: 'CASCADE' })
  photo!: Promise<PhotoEntity | null>;
}
