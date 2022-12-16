import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { UserEntity } from "./user.entity";


@Entity("UserSession")
export class UserSessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar' })
  sessionId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne((type) => UserEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  @JoinColumn()
  user!: Promise<UserEntity>;
}
