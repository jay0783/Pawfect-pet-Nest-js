import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerEntity } from '../customer';
import { EmployeeEntity } from '../employee';
import { UserRoleEnum } from './enums';
import { UserSessionEntity } from './user-session.entity';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
  })
  role!: UserRoleEnum;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne((type) => CustomerEntity, (c) => c.user, { lazy: true })
  customer!: Promise<CustomerEntity | undefined>;

  @OneToOne((type) => EmployeeEntity, (e) => e.user, { lazy: true })
  employee!: Promise<EmployeeEntity | undefined>;

  @OneToOne((type) => UserSessionEntity, (session) => session.user, {
    lazy: true,
  })
  session!: Promise<UserSessionEntity | undefined>;

  // @Column({ type: 'text', nullable: true })
  // deviceToken!: string;

  // @Column({ nullable: true })
  // deviceType!: number;
}
