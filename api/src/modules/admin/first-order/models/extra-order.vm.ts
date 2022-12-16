import { ExtraServiceEntity } from '@pawfect/db/entities';

export interface ExtraViewModel {
  id: string;
  title: string;
  description: string;
  price: number;
  //   imageUrl?: string;
}

export async function makeExtraViewModel(
  orderEntity: ExtraServiceEntity,
): Promise<ExtraViewModel> {
  // const employeeEntity = await orderEntity.employee;

  const ExtraServiceViewModel: ExtraViewModel = {
    id: orderEntity.id,
    title: orderEntity.title,
    description: orderEntity.description,
    price: orderEntity.price,
  };

  return ExtraServiceViewModel;
}
