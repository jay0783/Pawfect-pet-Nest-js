import { PaginationResponse } from '@pawfect/models';
import { makeZipCodeViewModelMany, ZipCodeViewModel } from './zip-code.vm';
import { ZipCodeEntity } from '@pawfect/db/entities';


export interface GetZipCodesResponse extends PaginationResponse<ZipCodeViewModel> {
}

export function makeGetZipCodesResponse(zipCodeEntities: ZipCodeEntity[]): GetZipCodesResponse {
  return {
    items: makeZipCodeViewModelMany(zipCodeEntities),
  };
}
