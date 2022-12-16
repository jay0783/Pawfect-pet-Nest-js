import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PetSizeEnum } from '../pet/enums';
import { CategoryEntity } from '../category.entity';
import { SubcategoryEntity } from '../subcategory.entity';
import { PhotoEntity } from '../photo.entity';
import { ServicePetTypeEntity } from './service-pet-type.entity';
import { ServiceCheckEntity } from './service-check.entity';

@Entity('Services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  sumDuration!: number;

  @Column()
  price!: number;

  @Column({ default: 3 }) //type = 1:Dog, 2:Cat, 3:All-animals
  type!: number;

  @Column({
    type: 'enum',
    enum: PetSizeEnum,
    nullable: true,
  })
  forPetSizeType?: PetSizeEnum | null;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(
    (type) => ServicePetTypeEntity,
    (servicePetType) => servicePetType.service,
    { lazy: true },
  )
  forSpeciesTypes!: Promise<Array<ServicePetTypeEntity>>;

  @ManyToOne((type) => PhotoEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  logo!: Promise<PhotoEntity | undefined>;

  @ManyToOne((type) => SubcategoryEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  subcategory!: Promise<SubcategoryEntity | null | undefined>;

  @ManyToOne((type) => CategoryEntity, { nullable: false, lazy: true })
  category!: Promise<CategoryEntity>;

  @OneToMany(
    (type) => ServiceCheckEntity,
    (serviceCheckType) => serviceCheckType.service,
    { lazy: true },
  )
  checklist!: Promise<Array<ServiceCheckEntity>>;
}
