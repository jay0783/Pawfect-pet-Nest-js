import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import { ServiceEntity } from "./service.entity";


@Entity("ServiceChecks")
export class ServiceCheckEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  duration!: number;

  @Column()
  numOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => ServiceEntity, { nullable: false, lazy: true, onDelete: "CASCADE" })
  service!: Promise<ServiceEntity>;

  @Column({ default: false })
  blocked!: boolean;
}
