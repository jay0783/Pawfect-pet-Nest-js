import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { TimeOffDateTypeEnum } from "@pawfect/db/entities/enums";
import { TimeOffEnum, TimeOffStatusEnum } from "./enums";
import { EmployeeEntity } from "./employee.entity";


@Entity("EmployeeTimeOffs")
export class EmployeeTimeOffEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: TimeOffStatusEnum
  })
  status!: TimeOffStatusEnum;

  @Column({
    type: "enum",
    enum: TimeOffEnum
  })
  type!: TimeOffEnum;

  @Column({
    type: "enum",
    enum: TimeOffDateTypeEnum
  })
  dateType!: TimeOffDateTypeEnum;

  @Column("date", { array: true })
  dates!: Array<Date>;

  @Column()
  dateFrom!: Date;

  @Column()
  dateTo!: Date;

  @Column({ nullable: true, type: "varchar" })
  notes?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => EmployeeEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  employee!: Promise<EmployeeEntity>;

  updateStartAndEndDates(): void {
    if (this.dates.length > 0) {
      const datesInMs = this.dates.map(date => +date);
      this.dateFrom = new Date(Math.min(...datesInMs));
      this.dateTo = new Date(Math.max(...datesInMs));
    }
  }
}
