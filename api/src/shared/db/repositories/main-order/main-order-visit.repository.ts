import { EntityRepository, Repository } from 'typeorm';
import { MainOrderVisitEntity } from '../../entities';

@EntityRepository(MainOrderVisitEntity)
export class MainOrderVisitRepository extends Repository<MainOrderVisitEntity> {}
