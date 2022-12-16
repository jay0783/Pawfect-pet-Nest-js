import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { EmployeePayrollRepository } from '@pawfect/db/repositories';
import { EmployeeEntity } from '@pawfect/db/entities';
import {
  GetMyPayrollsResponse,
  GetTotalPayrollsResponse,
  makePayrollViewModel,
} from './models';

@Injectable()
export class PayrollService {
  constructor(
    private readonly employeePayrollRepository: EmployeePayrollRepository,
  ) {}

  async getMyPayrolls(
    employeeEntity: EmployeeEntity,
    paginationOptions: IPaginationOptions,
  ): Promise<GetMyPayrollsResponse> {
    const payrolls = await this.employeePayrollRepository.getMyPayrolls(
      employeeEntity.id,
      paginationOptions,
    );

    const payrollViewModelsPromises = payrolls.items.map(async (payroll) =>
      makePayrollViewModel(payroll),
    );
    const payrollViewModels = await Promise.all(payrollViewModelsPromises);

    return { items: payrollViewModels, meta: payrolls.meta };
  }

  async getMyTotalPayrolls(
    employeeEntity: EmployeeEntity,
  ): Promise<GetTotalPayrollsResponse> {
    const amountEarned = await this.employeePayrollRepository.getMyAmountEarned(
      employeeEntity.id,
    );
    return { amountEarned: amountEarned };
  }
}
