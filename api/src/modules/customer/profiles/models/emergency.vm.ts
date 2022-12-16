import { CustomerEmergencyContactEntity } from '@pawfect/db/entities';

export interface EmergencyViewModel {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
}

export async function makeEmergencyViewModel(
  emergencyEntity: CustomerEmergencyContactEntity,
): Promise<EmergencyViewModel> {
  const viewModel: EmergencyViewModel = {
    id: emergencyEntity.id,
    name: emergencyEntity.name,
    phoneNumber: emergencyEntity.phoneNumber,
    createdAt: emergencyEntity.createdAt,
  };

  return viewModel;
}
