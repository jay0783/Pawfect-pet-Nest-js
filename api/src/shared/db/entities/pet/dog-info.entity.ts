import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PetCharacterEnum, PetSizeEnum } from './enums';
import { PetEntity } from './pet.entity';

@Entity('DogInfos')
export class DogInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @Column()
  size!: number;

  @Column({
    type: 'enum',
    enum: PetSizeEnum,
  })
  sizeType!: PetSizeEnum;

  @Column('varchar', { array: true })
  onWalksActions: Array<string> = new Array<string>();

  @Column('varchar', { array: true })
  onSomeoneEntryActions: Array<string> = new Array<string>();

  @Column({ type: 'boolean', nullable: true })
  isDoggyDoorExists!: boolean | null;

  @Column({
    type: 'enum',
    enum: PetCharacterEnum,
    nullable: true,
  })
  character!: PetCharacterEnum | null;

  @Column({ type: 'boolean', nullable: true })
  hasMedication!: boolean | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne((type) => PetEntity, {
    nullable: false,
    lazy: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  pet!: Promise<PetEntity>;
}
