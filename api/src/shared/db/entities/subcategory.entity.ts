import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";

import { CategoryEntity } from "./category.entity";
import { PhotoEntity } from "./photo.entity";


@Entity("Subcategories")
export class SubcategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => PhotoEntity, { nullable: true, lazy: true, onDelete: "SET NULL" })
  logo!: Promise<PhotoEntity | undefined | null>;

  @ManyToOne((type) => CategoryEntity, { nullable: false, lazy: true })
  category!: Promise<CategoryEntity>;
}
