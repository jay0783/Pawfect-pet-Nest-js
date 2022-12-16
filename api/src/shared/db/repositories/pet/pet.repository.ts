import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { VeterinarianModel } from '@pawfect/models';
import {
  CatInfoEntity,
  DogInfoEntity,
  OrderEntity,
  PetEntity,
  PetMedicationEntity,
  PetVaccinationEntity,
  PetVeterinarianEntity,
  PhotoEntity,
} from '@pawfect/db/entities';
import {
  DeleteVaccinationOptions,
  SaveCatOptions,
  SaveDogOptions,
} from './interfaces';
import { PetSpeciesEnum } from '@pawfect/db/entities/enums';

@EntityRepository(PetEntity)
export class PetRepository extends Repository<PetEntity> {
  private readonly dogInfoRepository: Repository<DogInfoEntity>;
  private readonly catInfoRepository: Repository<CatInfoEntity>;
  private readonly veterinarianRepository: Repository<PetVeterinarianEntity>;
  private readonly petMedicationRepository: Repository<PetMedicationEntity>;
  private readonly photoRepository: Repository<PhotoEntity>;
  private readonly petVaccinationRepository: Repository<PetVaccinationEntity>;

  constructor(readonly entityManager: EntityManager) {
    super();

    this.dogInfoRepository = entityManager.getRepository(DogInfoEntity);
    this.catInfoRepository = entityManager.getRepository(CatInfoEntity);
    this.veterinarianRepository = entityManager.getRepository(
      PetVeterinarianEntity,
    );
    this.petMedicationRepository = entityManager.getRepository(
      PetMedicationEntity,
    );
    this.photoRepository = entityManager.getRepository(PhotoEntity);
    this.petVaccinationRepository = entityManager.getRepository(
      PetVaccinationEntity,
    );
  }

  async getAllAsCustomer(
    customerId: string,
    paginationOpt: IPaginationOptions,
  ): Promise<Pagination<PetEntity>> {
    const query = this.createQueryBuilder('Pets')
      .where('Pets.customerId = :customerId', { customerId })
      .andWhere('Pets.isActive = true')
      .orderBy('Pets.updatedAt', 'DESC');

    const paginatePets = await paginate(query, paginationOpt);
    return paginatePets;
  }

  async saveCatInfo(
    petEntity: PetEntity,
    saveCatInfo: SaveCatOptions,
  ): Promise<CatInfoEntity> {
    const newCatEntity = (await petEntity.catInfo) || new CatInfoEntity();
    newCatEntity.age = saveCatInfo.age;
    newCatEntity.isSpayed = saveCatInfo.isSpayed || null;
    newCatEntity.feedingInstructions = saveCatInfo.feedingInstructions || null;
    newCatEntity.medicationInstructions =
      saveCatInfo.medicationInstructions || null;
    newCatEntity.locationOfLitterbox = saveCatInfo.locationOfLitterbox || null;
    newCatEntity.character = saveCatInfo.character || null;
    newCatEntity.hasMedication = saveCatInfo.hasMedication || null;
    newCatEntity.pet = Promise.resolve(petEntity);
    newCatEntity.dob = new Date(saveCatInfo.dob);
    await this.catInfoRepository.save(newCatEntity);

    return newCatEntity;
  }

  async saveDogInfo(
    petEntity: PetEntity,
    saveDog: SaveDogOptions,
  ): Promise<DogInfoEntity> {
    const newDogEntity = (await petEntity.dogInfo) || new DogInfoEntity();
    newDogEntity.age = saveDog.age;
    newDogEntity.isSpayed = saveDog.isSpayed || null;
    newDogEntity.feedingInstructions = saveDog.feedingInstructions || null;
    newDogEntity.medicationInstructions =
      saveDog.medicationInstructions || null;
    newDogEntity.size = saveDog.size;
    newDogEntity.sizeType = saveDog.sizeType;
    newDogEntity.onWalksActions = saveDog.onWalksActions;
    newDogEntity.onSomeoneEntryActions = saveDog.onSomeoneEntryActions;
    newDogEntity.isDoggyDoorExists = saveDog.isDoggyDoorExists || null;
    newDogEntity.character = saveDog.character || null;
    newDogEntity.hasMedication = saveDog.hasMedication || null;
    newDogEntity.dob = new Date(saveDog.dob);
    newDogEntity.pet = Promise.resolve(petEntity);

    await this.dogInfoRepository.save(newDogEntity);

    return newDogEntity;
  }

  async updateVeterinarianBulk(
    petEntity: PetEntity,
    veterinarians: Array<VeterinarianModel>,
  ): Promise<void> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const veterinarian of veterinarians) {
        if (!veterinarian.id) {
          const newPetVeterinarianEntity = new PetVeterinarianEntity();
          newPetVeterinarianEntity.name = veterinarian.name;
          newPetVeterinarianEntity.phoneNumber = veterinarian.phoneNumber;
          newPetVeterinarianEntity.pet = Promise.resolve(petEntity);

          await queryRunner.manager.save(
            PetVeterinarianEntity,
            newPetVeterinarianEntity,
          );
          continue;
        }

        await queryRunner.manager.update(
          PetVeterinarianEntity,
          veterinarian.id,
          {
            name: veterinarian.name,
            phoneNumber: veterinarian.phoneNumber,
            // pet: Promise.resolve(petEntity),
          },
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async addVeterinarianBulk(
    petEntity: PetEntity,
    veterinarians: Array<VeterinarianModel>,
  ): Promise<Array<PetVeterinarianEntity>> {
    const petVeterinarians: Array<PetVeterinarianEntity> = new Array<PetVeterinarianEntity>();

    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const veterinarian of veterinarians) {
        const veterinarianEntity = new PetVeterinarianEntity();
        veterinarianEntity.name = veterinarian.name;
        veterinarianEntity.phoneNumber = veterinarian.phoneNumber;
        veterinarianEntity.pet = Promise.resolve(petEntity);
        petVeterinarians.push(veterinarianEntity);
      }

      await queryRunner.manager.save(petVeterinarians);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return petVeterinarians;
  }

  async addVeterinarian(
    petEntity: PetEntity,
    veterinarian: VeterinarianModel,
  ): Promise<PetVeterinarianEntity> {
    const veterinarianEntity = new PetVeterinarianEntity();
    veterinarianEntity.name = veterinarian.name;
    veterinarianEntity.phoneNumber = veterinarian.phoneNumber;
    veterinarianEntity.pet = Promise.resolve(petEntity);

    await this.veterinarianRepository.save(veterinarianEntity);

    return veterinarianEntity;
  }

  async saveMedication(
    petEntity: PetEntity,
    { requirements, notes }: { requirements?: string; notes?: string },
  ): Promise<PetMedicationEntity> {
    const petMedicationEntity: PetMedicationEntity =
      (await petEntity.medication) || new PetMedicationEntity();
    petMedicationEntity.notes = notes || null;
    petMedicationEntity.requirements = requirements || null;
    petMedicationEntity.pet = Promise.resolve(petEntity);

    await this.petMedicationRepository.save(petMedicationEntity);

    return petMedicationEntity;
  }

  async setAvatar(
    petEntity: PetEntity,
    avatarFileEntity: PhotoEntity,
    afterAction?: (photoEntity: PhotoEntity | undefined) => Promise<void>,
  ): Promise<void> {
    const oldPhoto: PhotoEntity | undefined = await petEntity.photo;

    await this.photoRepository.save(avatarFileEntity);

    petEntity.photo = Promise.resolve(avatarFileEntity);
    await this.save(petEntity);

    if (afterAction) {
      await afterAction(oldPhoto);
    }
  }

  async addVaccination(
    petEntity: PetEntity,
    photoEntity: PhotoEntity,
  ): Promise<void> {
    await this.photoRepository.save(photoEntity);

    const petVaccinationEntity = new PetVaccinationEntity();
    petVaccinationEntity.pet = Promise.resolve(petEntity);
    petVaccinationEntity.photo = Promise.resolve(photoEntity);

    await this.petVaccinationRepository.save(petVaccinationEntity);
  }

  async deleteVaccination(
    deleteVaccinationOpt: DeleteVaccinationOptions,
    afterAction?: (photoEntity: PhotoEntity) => Promise<void>,
  ): Promise<void> {
    const vaccinationEntity:
      | PetVaccinationEntity
      | undefined = await this.petVaccinationRepository.findOne({
      where: {
        id: deleteVaccinationOpt.vaccinationId,
        pet: deleteVaccinationOpt.petId,
      },
      loadRelationIds: { relations: ['pet'] },
      relations: ['photo'],
    });

    if (!vaccinationEntity) {
      return;
    }

    await this.petVaccinationRepository.remove(vaccinationEntity);

    if (afterAction) {
      await afterAction(await vaccinationEntity.photo);
    }
  }

  async findPetsForOrder(
    customerId: string,
    orderDates: Array<{ dateFrom: DateTime; dateTo: DateTime }>,
    forPetTypes: Array<PetSpeciesEnum>,
  ): Promise<Array<PetEntity>> {
    const query = this.createQueryBuilder('Pets')
      .leftJoinAndMapOne(
        'Pets.photo',
        'Photos',
        'Photos',
        'Pets.photoId = Photos.id',
      )
      .where(
        '"Pets"."customerId" = :customerId AND "Pets"."type"::text IN (:...forPetTypes)',
        { customerId, forPetTypes },
      )
      .andWhere('Pets.isActive = :isActive', { isActive: true })
      .andWhere((qb) => {
        let subQuery = qb
          .subQuery()
          .select('MainOrderPets.petId')
          .from(OrderEntity, 'Orders')
          .innerJoin(
            'MainOrderPets',
            'MainOrderPets',
            'Orders.mainOrderId = MainOrderPets.mainOrderId',
          );

        for (const orderDate of orderDates) {
          subQuery = subQuery.orWhere(
            '(Orders.dateFrom <= :dateFrom::timestamp AND Orders.dateTo >= :dateTo::timestamp)',
            {
              dateFrom: orderDate.dateFrom.toJSDate(),
              dateTo: orderDate.dateTo.toJSDate(),
            },
          );
        }

        return `Pets.id NOT IN ${subQuery.getQuery()}`;
      });

    console.log(query.getQueryAndParameters());
    const pets = await query.getMany();
    return pets;
  }
}
