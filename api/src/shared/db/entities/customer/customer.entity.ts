import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Point } from 'geojson';

import { ZipCodeEntity } from '../zip-code.entity';
import { PhotoEntity } from '../photo.entity';
import { UserEntity } from '../user';
import { PetEntity } from '../pet';
import { CustomerHomeInfoEntity } from './customer-home-info.entity';
import { CustomerComingEntity } from './customer-coming.entity';
import { CustomerEmergencyContactEntity } from './customer-emergency-contact.entity';
import { MainOrderEntity } from '@pawfect/db/entities';

@Entity('Customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  surname!: string;

  @Column({ type: 'float', default: 0 })
  balance!: number;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({ nullable: true })
  workPhoneNumber!: string;

  @Column({ nullable: true })
  address!: string;

  @Column('geometry', { nullable: true })
  @Index({ spatial: true })
  addressPosition!: Point;

  @Column({ nullable: true })
  billingAddress!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  state!: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => ZipCodeEntity, { nullable: false, lazy: true })
  zipCode!: Promise<ZipCodeEntity>;

  @OneToOne((type) => UserEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Promise<UserEntity>;

  @ManyToOne((type) => PhotoEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  avatar!: Promise<PhotoEntity | undefined>;

  @OneToOne((type) => CustomerHomeInfoEntity, (homeInfo) => homeInfo.customer, {
    nullable: true,
    lazy: true,
  })
  homeInfo!: Promise<CustomerHomeInfoEntity | undefined>;

  @OneToOne((type) => CustomerComingEntity, (coming) => coming.customer, {
    nullable: true,
    lazy: true,
  })
  coming!: Promise<CustomerComingEntity | undefined>;

  @OneToMany((type) => PetEntity, (p) => p.customer, {
    nullable: true,
    lazy: true,
  })
  pets!: Promise<Array<PetEntity>>;

  @OneToMany((type) => MainOrderEntity, (p) => p.customer, {
    nullable: true,
    lazy: true,
  })
  mainOrders!: Promise<Array<MainOrderEntity>>;

  @OneToMany((type) => CustomerEmergencyContactEntity, (em) => em.customer, {
    lazy: true,
  })
  emergencies!: Promise<Array<CustomerEmergencyContactEntity>>;

  @Column({ default: 0 })
  status!: number;

  @Column({ default: false })
  isSameAddress!: boolean;

  @Column({ type: 'text', nullable: true })
  deviceToken!: string;

  @Column({ nullable: true })
  deviceType!: number;

  @Column({ default: false })
  isDeleted!: boolean;
}
