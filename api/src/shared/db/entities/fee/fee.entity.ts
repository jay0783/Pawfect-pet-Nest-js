import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { FeeEnum } from "./enums";


@Entity("Fees")
export class FeeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  amount!: number;

  @Column({
    type: "enum",
    enum: FeeEnum
  })
  type!: FeeEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
