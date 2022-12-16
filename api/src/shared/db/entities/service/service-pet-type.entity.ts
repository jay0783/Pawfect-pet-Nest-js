import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { PetSpeciesEnum } from "../pet/enums";
import { ServiceEntity } from "./service.entity";


@Entity("ServicePetTypes")
export class ServicePetTypeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: PetSpeciesEnum
  })
  petType!: PetSpeciesEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => ServiceEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  service!: Promise<ServiceEntity>;
}
