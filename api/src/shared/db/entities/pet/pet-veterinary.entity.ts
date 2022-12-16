import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { PetEntity } from "./pet.entity";


@Entity("PetVeterinaries")
export class PetVeterinarianEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  phoneNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => PetEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  pet!: Promise<PetEntity>;
}
