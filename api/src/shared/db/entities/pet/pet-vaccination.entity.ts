import {
  CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { PhotoEntity } from "../photo.entity";
import { PetEntity } from "./pet.entity";


@Entity("PetVaccinations")
export class PetVaccinationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => PetEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  pet!: Promise<PetEntity>;

  @ManyToOne((type) => PhotoEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  photo!: Promise<PhotoEntity>;
}
