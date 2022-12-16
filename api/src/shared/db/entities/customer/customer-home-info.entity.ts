import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { CustomerEntity } from "./customer.entity";
import { WeekDayEnum } from "./enums";


@Entity("CustomerHomeInfos")
export class CustomerHomeInfoEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  lockboxCode?: string | null;

  @Column({ type: "varchar", nullable: true })
  lockboxLocation?: string | null;

  @Column({ type: "varchar", nullable: true })
  homeAlarmSystem?: string | null;

  @Column({ type: "varchar", nullable: true })
  homeAccessNotes?: string | null;

  @Column({ type: "varchar", nullable: true })
  mailbox?: string | null;

  @Column({ default: false })
  isSomeoneWillBeAtHome!: boolean;

  @Column({ default: false })
  isTurnOnLight!: boolean;

  @Column({ default: false })
  isMailKeyProvided!: boolean;

  @Column({ default: false })
  isWaterPlantExists!: boolean;

  @Column({ type: "json", default: [] })
  trashPickUps: Array<WeekDayEnum> = new Array<WeekDayEnum>();

  @Column({ type: "varchar", nullable: true })
  otherRequest?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne((type) => CustomerEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  @JoinColumn()
  customer!: Promise<CustomerEntity>;
}
