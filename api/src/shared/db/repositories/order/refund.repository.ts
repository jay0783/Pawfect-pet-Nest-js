import { EntityRepository, Repository } from 'typeorm';
import { OrderRefundEntity } from '../../entities';

@EntityRepository(OrderRefundEntity)
export class RefundRepository extends Repository<OrderRefundEntity> {}
