import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";


@Entity("Holidays")
export class HolidayEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  day!: number;

  @Column()
  month!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
