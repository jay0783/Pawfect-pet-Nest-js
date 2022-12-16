import { EntityRepository, Repository } from "typeorm";

import { FeeEntity } from "../entities";
import { FeeEnum } from "../entities/enums";


@EntityRepository(FeeEntity)
export class FeeRepository extends Repository<FeeEntity> {
  async getFeeAmount(feeType: FeeEnum): Promise<number> {
    const feeEntity = await this.findOne({ where: { type: feeType } });
    return feeEntity?.amount || 0;
  }


  async setFee(amount: number, feeType: FeeEnum): Promise<FeeEntity> {
    const existFeeEntity = await this.findOne({ where: { type: feeType } }) || new FeeEntity();
    existFeeEntity.amount = amount;
    existFeeEntity.type = feeType;

    await this.save(existFeeEntity);
    return existFeeEntity;
  }
}
