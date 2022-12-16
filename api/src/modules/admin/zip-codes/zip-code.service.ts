import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { RemovableZipCodeEntity, ZipCodeRepository } from '@pawfect/db/repositories';
import {
  AddZipCodeRequest,
  AddZipCodeResponse,
  GetZipCodesResponse,
  makeAddZipCodeResponse,
  makeGetZipCodesResponse,
} from './models';
import { SuccessModel } from '@pawfect/models';


@Injectable()
export class ZipCodeService {
  constructor(
    private readonly zipCodeRepository: ZipCodeRepository,
  ) {
  }

  async addZipCode(zipCodeRequest: AddZipCodeRequest): Promise<AddZipCodeResponse> {
    const zipCodeEntity = await this.zipCodeRepository.findOne({ zipCode: zipCodeRequest.code });
    if (zipCodeEntity) {
      throw new BadRequestException('Zip-code already exists');
    }
    const createdZipCode = await this.zipCodeRepository.addZipCode(zipCodeRequest.code);

    return makeAddZipCodeResponse(createdZipCode);
  }

  async getAllZipCodes(): Promise<GetZipCodesResponse> {
    const zipCodeEntities = await this.zipCodeRepository.find();

    return makeGetZipCodesResponse(zipCodeEntities);
  }

  async deleteZipCode(zipCodeId: string): Promise<SuccessModel> {
    const zipCodeEntity: RemovableZipCodeEntity | undefined = await this.zipCodeRepository.getZipCodeWithUsers(zipCodeId);
    if (!zipCodeEntity) {
      throw new NotFoundException('Zip-code not found');
    }
    if (zipCodeEntity.employee || zipCodeEntity.customer) {
      throw new BadRequestException('Zip code has customers or employees');
    }

    await this.zipCodeRepository.remove(zipCodeEntity);

    return new SuccessModel();
  }
}
