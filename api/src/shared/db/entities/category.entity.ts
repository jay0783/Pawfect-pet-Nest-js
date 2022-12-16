import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ServiceEntity } from './service';
import { PhotoEntity } from './photo.entity';
import { SubcategoryEntity } from './subcategory.entity';

@Entity('Categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => PhotoEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  logo!: Promise<PhotoEntity | undefined | null>;

  @OneToMany(
    (type) => SubcategoryEntity,
    (subcategory) => subcategory.category,
    { lazy: true },
  )
  subcategories!: Promise<Array<SubcategoryEntity>>;

  @OneToMany((type) => ServiceEntity, (service) => service.category, {
    lazy: true,
  })
  services!: Promise<Array<ServiceEntity>>;

  @Column({ default: true })
  status!: boolean;
}
