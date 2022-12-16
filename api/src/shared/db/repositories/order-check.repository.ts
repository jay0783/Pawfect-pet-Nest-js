import { EntityRepository, Repository } from "typeorm";
import { OrderCheckEntity } from "../entities";


@EntityRepository(OrderCheckEntity)
export class OrderCheckRepository extends Repository<OrderCheckEntity> {

}
