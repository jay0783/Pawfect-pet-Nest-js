import { EmployeePayrollEntity } from '@pawfect/db/entities';
import { PaginationResponse } from '@pawfect/models';

export interface GetMyPayrollsResponse
  extends PaginationResponse<PayrollViewModel> {}

export interface PayrollViewModel {
  id: string;
  title: string;
  date: number;
  amount: number;
  orderAmount: number;
  jobRate: number;
}

export async function makePayrollViewModel(
  payroll: EmployeePayrollEntity,
): Promise<PayrollViewModel> {
  const order = await payroll.order;
  const service = await order.service;

  const viewModel: PayrollViewModel = {
    id: payroll.id,
    title: service.title,
    date: payroll.createdAt.getTime(),
    amount: payroll.amount,
    orderAmount: order.priceWithExtras,
    jobRate: payroll.empJobRate,
  };

  return viewModel;
}
