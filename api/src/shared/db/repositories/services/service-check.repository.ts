import { EntityRepository, Repository } from 'typeorm';
import { ServiceCheckEntity } from '@pawfect/db/entities';

@EntityRepository(ServiceCheckEntity)
export class ServiceCheckRepository extends Repository<ServiceCheckEntity> {
  async shiftNumOrder(
    serviceId: string,
    index: number,
    amount: number,
  ): Promise<void> {
    const query = this.createQueryBuilder('ServiceChecks')
      .update()
      .set({ numOrder: () => `"ServiceChecks"."numOrder" + ${amount}` })
      .where('"ServiceChecks"."numOrder" >= :index', { index: index })
      .andWhere('"ServiceChecks"."serviceId" = :serviceId', {
        serviceId: serviceId,
      });

    await query.execute();
  }
}
