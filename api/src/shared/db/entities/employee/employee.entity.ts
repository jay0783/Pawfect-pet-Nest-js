import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TimeMillisTransformer } from '@pawfect/db/transformers';
import { ZipCodeEntity, PhotoEntity } from '../';
import { UserEntity } from '../user';
import { EmployeeStatusEnum, TimeOffEnum } from './enums';
import { EmployeeTimeOffEntity } from './employee-time-off.entity';
import { EmployeeEmergencyContactEntity } from './employee-emergency-contact.entity';
import { EmployeeRatingEntity } from './employee-rating.entity';

@Entity('Employees')
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  address!: string;

  @Column({
    type: 'time',
    transformer: new TimeMillisTransformer(),
  })
  workTimeFrom!: number;

  @Column({
    type: 'time',
    transformer: new TimeMillisTransformer(),
  })
  workTimeTo!: number;

  @Column({ type: 'float', default: 0 })
  jobRate!: number;

  @Column({ type: 'float', default: 0 })
  rating!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

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

  @OneToMany((type) => EmployeeEmergencyContactEntity, (e) => e.employee, {
    lazy: true,
  })
  emergencies!: Promise<Array<EmployeeEmergencyContactEntity>>;

  @ManyToOne((type) => ZipCodeEntity, { nullable: false, lazy: true })
  zipCode!: Promise<ZipCodeEntity>;

  @OneToMany((type) => EmployeeRatingEntity, (rating) => rating.employee, {
    lazy: true,
  })
  employeeRatings!: Promise<Array<EmployeeRatingEntity>>;

  @Column({ type: 'text', nullable: true })
  deviceToken!: string;

  @Column({ nullable: true })
  deviceType!: number;

  @Column({ type: 'float', default: 0 })
  payroll!: number;

  @Column({ default: 0 })
  totalTime!: number;

  @Column({ type: 'float', default: 0 })
  orderAmount!: number;

  getStatusByTimeOff(
    timeOffEntity: EmployeeTimeOffEntity | undefined,
  ): EmployeeStatusEnum {
    if (!timeOffEntity) {
      return EmployeeStatusEnum.AVAILABLE;
    }

    switch (timeOffEntity.type) {
      case TimeOffEnum.BUSINESS_TRIP:
        return EmployeeStatusEnum.VACATION;

      case TimeOffEnum.SICK:
        return EmployeeStatusEnum.SICK_LEAVE;

      case TimeOffEnum.OTHER:
        return EmployeeStatusEnum.UNAVAILABLE;

      default:
        return EmployeeStatusEnum.UNAVAILABLE;
    }
  }
}
