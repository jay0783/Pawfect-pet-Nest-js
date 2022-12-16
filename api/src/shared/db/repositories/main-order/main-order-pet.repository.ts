import { EntityRepository, Repository } from "typeorm";

import { MainOrderEntity, MainOrderPetEntity } from "@pawfect/db/entities";


@EntityRepository(MainOrderPetEntity)
export class MainOrderPetRepository extends Repository<MainOrderPetEntity> {
  async getByMainOrderId(mainOrder: MainOrderEntity): Promise<Array<MainOrderPetEntity>> {
    const mainOrderPetsEntities = await this.find({
      where: { mainOrder },
      join: { alias: "MainOrderPet", innerJoin: { pet: "MainOrderPet.pet" } }
    });

    return mainOrderPetsEntities;
  }


  async isFirstMeet(employeeId: string, petsIds: Array<string>): Promise<boolean> {
    const query = this.createQueryBuilder("MainOrderPets")
      .distinct(true)
      .innerJoin("Orders", "Orders", "MainOrderPets.mainOrderId = Orders.mainOrderId")
      .where('"Orders"."employeeId"::text = :employeeId', { employeeId })
      .andWhere('"MainOrderPets"."petId"::text in (:petsIds)', { petsIds });

    const petsWithEmployee: Array<MainOrderPetEntity> = await query.getMany();

    return petsWithEmployee.length !== petsIds.length;
  }
}
