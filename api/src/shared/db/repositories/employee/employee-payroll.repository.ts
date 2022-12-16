import { EntityRepository, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { EmployeePayrollEntity } from '@pawfect/db/entities';
import { PaginationRequest } from '@pawfect/models';

@EntityRepository(EmployeePayrollEntity)
export class EmployeePayrollRepository extends Repository<EmployeePayrollEntity> {
  async getMyAmountEarned(employeeId: string): Promise<number> {
    const query = this.createQueryBuilder('EmployeePayrolls')
      .select('SUM(EmployeePayrolls.amount)', 'sum')
      .where('EmployeePayrolls.employeeId = :employeeId', { employeeId });

    const raw = await query.getRawOne();

    return Object.prototype.hasOwnProperty.call(raw, 'sum') ? +raw.sum : 0;
  }

  async getMyPayrolls(
    employeeId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<EmployeePayrollEntity>> {
    return paginate(this, paginationOptions, {
      where: { employee: employeeId },
      order: { createdAt: 'DESC' },
      relations: ['order', 'order.service'],
    });
  }
}
