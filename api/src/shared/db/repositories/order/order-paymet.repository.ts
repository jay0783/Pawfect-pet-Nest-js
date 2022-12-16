import { EntityRepository, Repository } from 'typeorm';
import { OrderPaymentEntity } from '../../entities';

@EntityRepository(OrderPaymentEntity)
export class PaymentRepository extends Repository<OrderPaymentEntity> {}
