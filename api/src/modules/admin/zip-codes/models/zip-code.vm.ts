import { ZipCodeEntity } from '@pawfect/db/entities';


export interface ZipCodeViewModel {
  id: string;
  code: string;
}

export function makeZipCodeViewModel(entity: ZipCodeEntity): ZipCodeViewModel {
  return {
    id: entity.id,
    code: entity.zipCode,
  };
}

export function makeZipCodeViewModelMany(zipCodes: ZipCodeEntity[]): ZipCodeViewModel[] {
  return zipCodes.map(zipCode => makeZipCodeViewModel(zipCode));
}
