import { EmployeeEntity, PhotoEntity } from '@pawfect/db/entities';

export interface EmployeePayrollViewModel {
  id: string;
  name: string;
  surname: string;
  time: number;
  amount: number;
  rate: number;
  payroll: number;
  imageUrl: string | null;
}

export async function makeEmployeePayrollViewModel(
  employeeEntity: EmployeeEntity,
): Promise<EmployeePayrollViewModel> {
  const employeeAvatar: PhotoEntity | undefined = await employeeEntity.avatar;

  const viewModel: EmployeePayrollViewModel = {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    time: employeeEntity.totalTime,
    amount: employeeEntity.orderAmount,
    rate: employeeEntity.jobRate,
    payroll: employeeEntity.payroll,
    imageUrl: employeeAvatar?.url || null,
  };

  return viewModel;
}
