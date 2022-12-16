import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PetCharacterEnum } from './enums';
import { PetEntity } from './pet.entity';

@Entity('CatInfos')
export class CatInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne((type) => PetEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pet!: Promise<PetEntity>;

  @Column({ nullable: true, default: new Date() })
  dob!: Date;

  @Column({ default: 0, nullable: true })
  age!: number;

  @Column({ type: 'boolean', nullable: true })
  isSpayed!: boolean | null;

  @Column({ type: 'text', nullable: true })
  feedingInstructions!: string | null;

  @Column({ type: 'text', nullable: true })
  medicationInstructions!: string | null;

  @Column({ type: 'varchar', nullable: true })
  locationOfLitterbox!: string | null;

  @Column({ type: 'boolean', nullable: true })
  hasMedication!: boolean | null;

  @Column({
    type: 'enum',
    enum: PetCharacterEnum,
    nullable: true,
  })
  character!: PetCharacterEnum | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
