import { EntityRepository, Repository } from 'typeorm';

import { BookingRestrictionsEntity } from '../../entities';

@EntityRepository(BookingRestrictionsEntity)
export class BookingRestrictionsRepository extends Repository<BookingRestrictionsEntity> {}
