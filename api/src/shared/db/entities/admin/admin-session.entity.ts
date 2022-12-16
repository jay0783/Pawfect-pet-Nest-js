import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { AdminEntity } from "./admin.entity";


@Entity("AdminSession")
export class AdminSessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  accessToken!: string;

  @Column()
  expiredRefreshDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne((type) => AdminEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  @JoinColumn()
  admin!: Promise<AdminEntity>;
}
