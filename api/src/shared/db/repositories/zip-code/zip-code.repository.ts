import { EntityRepository, Repository } from 'typeorm';

import { ZipCodeEntity } from '../../entities';
import { RemovableZipCodeEntity } from './extended-entities';


@EntityRepository(ZipCodeEntity)
export class ZipCodeRepository extends Repository<ZipCodeEntity> {

  async addZipCode(zipCode: string): Promise<ZipCodeEntity> {
    const newZipCode = new ZipCodeEntity();
    newZipCode.zipCode = zipCode;

    await this.save(newZipCode);

    return newZipCode;
  }

  async getZipCodeWithUsers(zipCodeId: string): Promise<RemovableZipCodeEntity | undefined> {
    const zipCodeEntity: RemovableZipCodeEntity | undefined = await this.createQueryBuilder('ZipCodes')
      .leftJoinAndMapOne('ZipCodes.customer', 'Customers', 'Customers', 'ZipCodes.id = Customers.zipCodeId')
      .leftJoinAndMapOne('ZipCodes.employee', 'Employees', 'Employees', 'ZipCodes.id = Employees.zipCodeId')
      .where('ZipCodes.id = :zipCodeId', { zipCodeId })
      .getOne();

    return zipCodeEntity;
  }
}
