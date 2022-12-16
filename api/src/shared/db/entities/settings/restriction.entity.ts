import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('BookingRestrictions')
export class BookingRestrictionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unsigned: true, default: 0 })
  months!: number;

  @Column({ unsigned: true, default: 0 })
  days!: number;

  @Column({ unsigned: true, default: 0 })
  hours!: number;

  @Column({ unsigned: true, default: 0 })
  minutes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: true })
  status!: boolean;
}
