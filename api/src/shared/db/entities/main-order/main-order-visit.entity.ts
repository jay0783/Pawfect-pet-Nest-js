import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { MainOrderVisitEnum } from "./enums";
import { MainOrderEntity } from "./main-order.entity";


@Entity("MainOrderVisits")
export class MainOrderVisitEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  timeFrom!: Date;

  @Column()
  timeTo!: Date;

  @Column({
    type: "enum",
    enum: MainOrderVisitEnum
  })
  type!: MainOrderVisitEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(type => MainOrderEntity, { nullable: false, lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  mainOrder!: Promise<MainOrderEntity>;
}
