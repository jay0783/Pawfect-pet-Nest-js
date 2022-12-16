import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerEntity } from '../customer';
import { PhotoEntity } from '../photo.entity';
import { PetGenderEnum, PetSpeciesEnum } from './enums';
import { DogInfoEntity } from './dog-info.entity';
import { CatInfoEntity } from './cat-info.entity';
import { PetMedicationEntity } from './pet-medication.entity';
import { PetVeterinarianEntity } from './pet-veterinary.entity';
import { PetVaccinationEntity } from './pet-vaccination.entity';
import { MainOrderPetEntity } from '../main-order';

@Entity('Pets')
export class PetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: PetGenderEnum,
  })
  gender!: PetGenderEnum;

  @Column({ type: 'varchar', nullable: true })
  breed!: string | null;

  @Column({
    type: 'enum',
    enum: PetSpeciesEnum,
  })
  type!: PetSpeciesEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => PhotoEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  photo!: Promise<PhotoEntity>;

  @ManyToOne((type) => CustomerEntity, (c) => c.pets, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  customer!: Promise<CustomerEntity>;

  @OneToOne((type) => DogInfoEntity, (d) => d.pet, {
    nullable: false,
    lazy: true,
  })
  dogInfo!: Promise<DogInfoEntity | undefined>;

  @OneToOne((type) => CatInfoEntity, (c) => c.pet, {
    nullable: false,
    lazy: true,
  })
  catInfo!: Promise<CatInfoEntity | undefined>;

  @OneToOne((type) => PetMedicationEntity, (m) => m.pet, {
    nullable: false,
    lazy: true,
  })
  medication!: Promise<PetMedicationEntity | undefined>;

  @OneToMany((type) => PetVeterinarianEntity, (v) => v.pet, {
    nullable: false,
    lazy: true,
  })
  veterinarians!: Promise<Array<PetVeterinarianEntity>>;

  @OneToMany((type) => PetVaccinationEntity, (v) => v.pet, {
    nullable: false,
    lazy: true,
  })
  vaccinations!: Promise<Array<PetVaccinationEntity>>;

  @Column({ default: true })
  isActive!: boolean;
}
