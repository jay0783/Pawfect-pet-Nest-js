import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { CustomerEntity } from "./customer.entity";


@Entity("CustomerEmergencyContacts")
export class CustomerEmergencyContactEntity {
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

  @ManyToOne((type) => CustomerEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  customer!: Promise<CustomerEntity>;
}
