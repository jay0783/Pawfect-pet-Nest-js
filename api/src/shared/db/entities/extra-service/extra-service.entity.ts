import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PhotoEntity } from '../photo.entity';

@Entity('ExtraServices')
export class ExtraServiceEntity {
  // map(
  //   arg0: (
  //     ExtraServiceEntity: ExtraServiceEntity,
  //   ) => Promise<
  //     import('../../../../modules/admin/first-order/models').ExtraViewModel
  //   >,
  // ) {
  //   throw new Error('Method not implemented.');
  // }
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  price!: number;

  @ManyToOne((type) => PhotoEntity, {
    nullable: true,
    lazy: true,
    onDelete: 'SET NULL',
  })
  logo!: Promise<PhotoEntity | undefined | null>;

  @Column({ default: true })
  status!: boolean;
}
