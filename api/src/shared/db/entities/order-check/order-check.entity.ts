import {
  Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { OrderEntity } from "../order";
import { PhotoEntity } from "../photo.entity";
import { OrderCheckActionEntity } from "./order-check-action.entity";
import { OrderCheckAttachmentEntity } from "./order-check-attachment.entity";


@Entity("OrderChecks")
export class OrderCheckEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  numOrder!: number;

  @Column()
  name!: string;

  @Column({ type: "timestamp without time zone", nullable: true })
  dateStart?: Date | null;

  @Column({ type: "timestamp without time zone", nullable: true })
  dateEnd?: Date | null;

  @Column()
  duration!: number;

  @Column({ unsigned: true, default: 0 })
  trackedDuration!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => PhotoEntity, { nullable: true, lazy: true, onDelete: "SET NULL" })
  logo!: Promise<PhotoEntity | undefined>;

  @ManyToOne(type => OrderEntity, { nullable: false, lazy: true, onDelete: "CASCADE", onUpdate: 'CASCADE' })
  order!: Promise<OrderEntity>;

  @OneToMany(type => OrderCheckAttachmentEntity, orderAttachment => orderAttachment.orderCheck, { lazy: true })
  attachments!: Promise<Array<OrderCheckAttachmentEntity>>;

  @OneToMany(type => OrderCheckActionEntity, action => action.orderCheck, { lazy: true })
  actions!: Promise<Array<OrderCheckActionEntity>>;
}
