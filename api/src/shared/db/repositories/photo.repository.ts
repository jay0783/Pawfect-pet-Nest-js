import { EntityRepository, Repository } from "typeorm";
import { PhotoEntity } from "../entities";


@EntityRepository(PhotoEntity)
export class PhotoRepository extends Repository<PhotoEntity> {

}
