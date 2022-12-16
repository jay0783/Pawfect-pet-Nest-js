import {
  Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { AdminSessionEntity } from "./admin-session.entity";


@Entity("Admins")
export class AdminEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


  @OneToOne((type) => AdminSessionEntity, (session) => session.admin, { nullable: false, lazy: true })
  session!: Promise<AdminSessionEntity | undefined>;
}
