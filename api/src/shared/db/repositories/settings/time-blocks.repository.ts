import { EntityRepository, Repository } from 'typeorm';
import { TimeBlocksEntity } from '../../entities';

@EntityRepository(TimeBlocksEntity)
export class TimeBlocksRepository extends Repository<TimeBlocksEntity> {}
