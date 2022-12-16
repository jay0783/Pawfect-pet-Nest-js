import { EntityRepository, Repository } from 'typeorm';
import { ServicePetTypeEntity } from '@pawfect/db/entities';

@EntityRepository(ServicePetTypeEntity)
export class ServicePetRepository extends Repository<ServicePetTypeEntity> {}
