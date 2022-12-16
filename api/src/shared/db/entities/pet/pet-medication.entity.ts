import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { PetEntity } from "./pet.entity";


@Entity("PetMedications")
export class PetMedicationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  requirements?: string | null;

  @Column({ type: "varchar", nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne((type) => PetEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  @JoinColumn()
  pet!: Promise<PetEntity>;
}
