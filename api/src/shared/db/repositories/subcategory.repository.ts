import { EntityRepository, Repository } from "typeorm";
import { SubcategoryEntity } from "../entities";


@EntityRepository(SubcategoryEntity)
export class SubcategoryRepository extends Repository<SubcategoryEntity> {

}
