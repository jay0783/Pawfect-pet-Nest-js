import {
  CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { PetEntity } from "../pet";
import { MainOrderEntity } from "./main-order.entity";


@Entity("MainOrderPets")
export class MainOrderPetEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(type => MainOrderEntity, { nullable: false, lazy: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  mainOrder!: Promise<MainOrderEntity>;

  @ManyToOne((type) => PetEntity, { nullable: false, lazy: true })
  pet!: Promise<PetEntity>;
}
