import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { UserEntity } from "./user.entity";


@Entity("UserPasswordRecoveries")
export class UserPasswordRecoveryEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { length: 36 })
  code!: string;

  @Column()
  expireDate!: Date;

  @Column({ default: false })
  isUsed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => UserEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  user!: Promise<UserEntity>;
}
