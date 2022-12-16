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
import { OrderEntity } from '../order';
import { PetEntity } from '../pet';
import { ServiceEntity } from '../service';
import { MainOrderStatusEnum } from './enums';
import { MainOrderDayEntity } from './main-order-day.entity';
import { MainOrderExtraServiceEntity } from './main-order-extra-service.entity';
import { MainOrderPetEntity } from './main-order-pet.entity';
import { MainOrderVisitEntity } from './main-order-visit.entity';

@Entity('MainOrders')
export class MainOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: MainOrderStatusEnum,
  })
  status!: MainOrderStatusEnum;

  @Column()
  firstDate!: Date;

  @Column()
  lastDate!: Date;

  @Column({ type: 'varchar', nullable: true })
  comment?: string | null;

  @Column({ unsigned: true, type: 'float', default: 25 })
  totalAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne((type) => ServiceEntity, { nullable: false, lazy: true })
  service!: Promise<ServiceEntity>;

  @ManyToOne((type) => CustomerEntity, { nullable: false, lazy: true })
  customer!: Promise<CustomerEntity>;

  @OneToMany((type) => OrderEntity, (order) => order.mainOrder, { lazy: true })
  orders!: Promise<Array<OrderEntity>>;

  // TODO 02.04.21: rewrite to ManyToMany. will delete pets-getter
  @OneToMany((type) => MainOrderPetEntity, (mop) => mop.mainOrder, {
    lazy: true,
  })
  mainOrderPets!: Promise<Array<MainOrderPetEntity>>;

  @OneToMany((type) => MainOrderExtraServiceEntity, (es) => es.mainOrder, {
    lazy: true,
  })
  mainOrderExtras!: Promise<Array<MainOrderExtraServiceEntity>>;

  @OneToMany((type) => MainOrderDayEntity, (day) => day.mainOrder, {
    lazy: true,
  })
  dates!: Promise<Array<MainOrderDayEntity>>;

  @OneToMany((type) => MainOrderVisitEntity, (v) => v.mainOrder, { lazy: true })
  visits!: Promise<Array<MainOrderVisitEntity>>;

  // TODO 02.04.21: rewrite to ManyToMany. will delete pets-getter
  get pets(): Promise<Array<PetEntity>> {
    return this.mainOrderPets.then(async (mainOrderPetsEntities) => {
      const petEntitiesPromises = mainOrderPetsEntities.map(
        (mainOrderPet) => mainOrderPet.pet,
      );
      const petEntities = await Promise.all(petEntitiesPromises);
      return petEntities;
    });
  }
}
