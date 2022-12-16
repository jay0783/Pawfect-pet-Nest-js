import { EmployeePayrollEntity } from "@pawfect/db/entities";
import { PaginationResponse } from "@pawfect/models";


export interface GetMyPayrollsResponse extends PaginationResponse<PayrollViewModel> {
}


export interface PayrollViewModel {
  title: string;
  date: number;
  amount: number;
}


export async function makePayrollViewModel(payroll: EmployeePayrollEntity): Promise<PayrollViewModel> {
  const order = await payroll.order;
  const service = await order.service;

  const viewModel: PayrollViewModel = {
    title: service.title,
    date: payroll.createdAt.getTime(),
    amount: payroll.amount
  };

  return viewModel;
}
