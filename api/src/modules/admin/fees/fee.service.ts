import { Injectable } from '@nestjs/common';

import { FeeEnum } from '@pawfect/db/entities/enums';
import { FeeRepository } from '@pawfect/db/repositories';
import { GetFeeResponse, SetFeeRequest } from './models';

@Injectable()
export class FeeService {
  constructor(private readonly feeRepository: FeeRepository) {}

  async setFee(
    setFeeRequest: SetFeeRequest,
    feeType: FeeEnum,
  ): Promise<GetFeeResponse> {
    const feeEntity = await this.feeRepository.setFee(
      setFeeRequest.amount,
      feeType,
    );
    return { amount: feeEntity.amount };
  }

  async getFee(feeType: FeeEnum): Promise<GetFeeResponse> {
    const feeAmount = await this.feeRepository.getFeeAmount(feeType);
    return { amount: feeAmount };
  }
}
