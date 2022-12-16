import { EntityRepository, In, Repository } from 'typeorm';
import { ExtraServiceEntity } from '@pawfect/db/entities';

@EntityRepository(ExtraServiceEntity)
export class ExtraServiceRepository extends Repository<ExtraServiceEntity> {
  async findByIdsAndCalculate(
    ids: Array<string>,
  ): Promise<{
    extrasEntities: Array<ExtraServiceEntity>;
    totalAmount: number;
  }> {
    const extraEntities: Array<ExtraServiceEntity> = await this.find({
      where: { id: In(ids) },
    });
    const totalExtrasAmount = extraEntities.reduce(
      (accum, item) => accum + item.price,
      0,
    );
    return { extrasEntities: extraEntities, totalAmount: totalExtrasAmount };
  }
}
