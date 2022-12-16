import { EntityManager, EntityRepository, Repository } from 'typeorm';
import {
  ServiceCheckEntity,
  ServiceEntity,
  ServicePetTypeEntity,
} from '../../entities';
import { PetSpeciesEnum } from '@pawfect/db/entities/enums';

@EntityRepository(ServiceEntity)
export class ServiceRepository extends Repository<ServiceEntity> {
  private readonly serviceCheckRepository: Repository<ServiceCheckEntity>;
  private readonly servicePetTypeRepository: Repository<ServicePetTypeEntity>;

  constructor(entityManager: EntityManager) {
    super();
    this.serviceCheckRepository = entityManager.getRepository(
      ServiceCheckEntity,
    );
    this.servicePetTypeRepository = entityManager.getRepository(
      ServicePetTypeEntity,
    );
  }

  async getServiceChecks(
    serviceEntity: ServiceEntity,
  ): Promise<Array<ServiceCheckEntity>> {
    const serviceCheckEntities = await this.serviceCheckRepository.find({
      where: { service: { id: serviceEntity.id }, blocked: false },
      join: {
        alias: 'ServiceChecks',
        innerJoin: { service: 'ServiceChecks.service' },
      },
    });

    return serviceCheckEntities;
  }

  async updateServiceSpeciesTypes(
    serviceEntity: ServiceEntity,
    newPetTypes: PetSpeciesEnum[],
  ): Promise<ServiceEntity> {
    const servicePetTypes = await serviceEntity.forSpeciesTypes;

    const petTypesForDelete: ServicePetTypeEntity[] = servicePetTypes.filter(
      (petTypeEntity) => {
        return !newPetTypes.includes(petTypeEntity.petType);
      },
    );

    const petTypesEntitiesForCreate: ServicePetTypeEntity[] = [];
    for (const petTypeName of newPetTypes) {
      const serviceContainPetType = servicePetTypes.some(
        (petTypeEntity) => petTypeEntity.petType === petTypeName,
      );
      if (!serviceContainPetType) {
        const newPetType = new ServicePetTypeEntity();
        newPetType.petType = petTypeName;
        newPetType.service = Promise.resolve(serviceEntity);
        petTypesEntitiesForCreate.push(newPetType);
      }
    }

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.servicePetTypeRepository.remove(petTypesForDelete);
      await this.servicePetTypeRepository.save(petTypesEntitiesForCreate);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return serviceEntity;
  }
}
