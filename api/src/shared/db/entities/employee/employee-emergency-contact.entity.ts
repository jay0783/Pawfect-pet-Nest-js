import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { EmployeeEntity } from "./employee.entity";


@Entity("EmployeeEmergencyContacts")
export class EmployeeEmergencyContactEntity {
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

  @ManyToOne((type) => EmployeeEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  employee!: Promise<EmployeeEntity>;
}
