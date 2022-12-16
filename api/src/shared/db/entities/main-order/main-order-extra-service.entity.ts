import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { ExtraServiceEntity } from "../extra-service";
import { MainOrderEntity } from "./main-order.entity";


@Entity("MainOrderExtraServices")
export class MainOrderExtraServiceEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(type => ExtraServiceEntity, { nullable: false, lazy: true })
  extraService!: Promise<ExtraServiceEntity>;

  @ManyToOne(type => MainOrderEntity, { nullable: false, lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  mainOrder!: Promise<MainOrderEntity>;

  @Column()
  price!: number;
}
