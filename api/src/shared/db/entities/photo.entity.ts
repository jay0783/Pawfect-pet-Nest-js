import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";


@Entity("Photos")
export class PhotoEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  awsS3Key!: string;

  @Column()
  url!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
