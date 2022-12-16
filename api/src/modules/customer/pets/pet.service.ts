import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DateTime } from 'luxon';

import {
  CustomerEntity,
  PetEntity,
  PhotoEntity,
  ServiceEntity,
} from '@pawfect/db/entities';
import {
  MainOrderRepository,
  PetRepository,
  ServiceRepository,
} from '@pawfect/db/repositories';
import { AwsS3Lib, FileLib, FolderEnum } from '@pawfect/libs/aws-s3';
import {
  makePetInfoResponse,
  PaginationResponse,
  SuccessModel,
  PetInfoResponse,
} from '@pawfect/models';
import {
  AddSmallPetRequest,
  PetItemListResponse,
  UpdateDogRequest,
  AddDogRequest,
  AddCatRequest,
  UpdateCatRequest,
  UpdateSmallAnimalRequest,
  GetForOrderRequest,
  GetForOrderResponse,
  OrderPetItem,
  AddPetResponse,
} from './models';
import { GetVaccinationResponse } from './models/get-vaccination.response';
import {
  makeVaccinationViewModel,
  VaccinationViewModel,
} from './models/vaccination.vm';
import { MainOrderStatusEnum } from '@pawfect/db/entities/enums';

@Injectable()
export class PetService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly awsS3Lib: AwsS3Lib,
    private readonly eventEmitter: EventEmitter2,
    private readonly serviceRepository: ServiceRepository,
    private readonly mainOrderRepository: MainOrderRepository,
  ) {}

  async getAll(
    customer: CustomerEntity,
    paginationOpt: IPaginationOptions,
  ): Promise<PaginationResponse<PetItemListResponse>> {
    const paginatePetEntities: Pagination<PetEntity> = await this.petRepository.getAllAsCustomer(
      customer.id,
      paginationOpt,
    );

    const petItems: Array<PetItemListResponse> = [];
    for (const petEntity of paginatePetEntities.items) {
      const petItem: PetItemListResponse = {
        id: petEntity.id,
        name: petEntity.name,
        breed: petEntity.breed,
        gender: petEntity.gender,
      };

      const petImageFile:
        | PhotoEntity
        | undefined
        | null = await petEntity.photo;
      if (petImageFile) {
        petItem.imageUrl = petImageFile.url;
      }

      petItems.push(petItem);
    }

    return { items: petItems, meta: paginatePetEntities.meta };
  }

  async addDog(
    customerEntity: CustomerEntity,
    addDogRequest: AddDogRequest,
  ): Promise<AddPetResponse> {
    const newPetEntity = new PetEntity();
    newPetEntity.name = addDogRequest.name;
    newPetEntity.gender = addDogRequest.gender;
    newPetEntity.type = addDogRequest.speciesType;
    newPetEntity.customer = Promise.resolve(customerEntity);
    newPetEntity.breed = addDogRequest.breed || null;

    await this.petRepository.save(newPetEntity);

    await this.petRepository.saveDogInfo(newPetEntity, addDogRequest);
    await this.petRepository.addVeterinarianBulk(
      newPetEntity,
      addDogRequest.veterinarians,
    );
    await this.petRepository.saveMedication(newPetEntity, {
      requirements: addDogRequest.medicalRequirements,
      notes: addDogRequest.medicalNotes,
    });

    const petItemListResponse: AddPetResponse = {
      id: newPetEntity.id,
    };

    return petItemListResponse;
  }

  async addCat(
    customerEntity: CustomerEntity,
    addCatRequest: AddCatRequest,
  ): Promise<AddPetResponse> {
    const newPetEntity = new PetEntity();
    newPetEntity.name = addCatRequest.name;
    newPetEntity.gender = addCatRequest.gender;
    newPetEntity.type = addCatRequest.speciesType;
    newPetEntity.customer = Promise.resolve(customerEntity);
    newPetEntity.breed = addCatRequest.breed || null;

    await this.petRepository.save(newPetEntity);

    await this.petRepository.saveCatInfo(newPetEntity, addCatRequest);
    await this.petRepository.addVeterinarianBulk(
      newPetEntity,
      addCatRequest.veterinarians,
    );
    await this.petRepository.saveMedication(newPetEntity, {
      requirements: addCatRequest.medicalRequirements,
      notes: addCatRequest.medicalNotes,
    });

    const petItemListResponse: AddPetResponse = {
      id: newPetEntity.id,
    };

    return petItemListResponse;
  }

  async addSmallAnimal(
    customerEntity: CustomerEntity,
    addSmallAnimalRequest: AddSmallPetRequest,
  ): Promise<AddPetResponse> {
    const newPetEntity = new PetEntity();
    newPetEntity.name = addSmallAnimalRequest.name;
    newPetEntity.gender = addSmallAnimalRequest.gender;
    newPetEntity.type = addSmallAnimalRequest.speciesType;
    newPetEntity.customer = Promise.resolve(customerEntity);
    newPetEntity.breed = addSmallAnimalRequest.breed || null;

    await this.petRepository.save(newPetEntity);

    await this.petRepository.addVeterinarianBulk(
      newPetEntity,
      addSmallAnimalRequest.veterinarians,
    );
    await this.petRepository.saveMedication(newPetEntity, {
      notes: addSmallAnimalRequest.medicalNotes,
    });

    const petItemListResponse: AddPetResponse = {
      id: newPetEntity.id,
    };

    return petItemListResponse;
  }

  async getPetInfo(petId: string): Promise<PetInfoResponse> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['medication', 'veterinarians', 'dogInfo', 'catInfo', 'photo'],
    });
    if (!petEntity) {
      throw new NotFoundException('Pet not found');
    }

    return makePetInfoResponse(petEntity);
  }

  async editDog(
    customerEntity: CustomerEntity,
    petId: string,
    updateDogRequest: UpdateDogRequest,
  ): Promise<SuccessModel> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
    });
    if (!petEntity) {
      throw new NotFoundException('pet was not found!');
    }

    petEntity.name = updateDogRequest.name;
    petEntity.gender = updateDogRequest.gender;
    petEntity.customer = Promise.resolve(customerEntity);
    petEntity.breed = updateDogRequest.breed || null;

    await this.petRepository.save(petEntity);

    await this.petRepository.saveDogInfo(petEntity, updateDogRequest);
    await this.petRepository.updateVeterinarianBulk(
      petEntity,
      updateDogRequest.veterinarians,
    );
    await this.petRepository.saveMedication(petEntity, {
      requirements: updateDogRequest.medicalRequirements,
      notes: updateDogRequest.medicalNotes,
    });

    return new SuccessModel();
  }

  async editCat(
    customerEntity: CustomerEntity,
    petId: string,
    updateCatRequest: UpdateCatRequest,
  ): Promise<SuccessModel> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
    });
    if (!petEntity) {
      throw new NotFoundException('pet was not found!');
    }

    petEntity.name = updateCatRequest.name;
    petEntity.gender = updateCatRequest.gender;
    petEntity.customer = Promise.resolve(customerEntity);
    petEntity.breed = updateCatRequest.breed || null;

    await this.petRepository.save(petEntity);

    await this.petRepository.saveCatInfo(petEntity, updateCatRequest);
    await this.petRepository.updateVeterinarianBulk(
      petEntity,
      updateCatRequest.veterinarians,
    );
    await this.petRepository.saveMedication(petEntity, {
      requirements: updateCatRequest.medicalRequirements,
      notes: updateCatRequest.medicalNotes,
    });

    return new SuccessModel();
  }

  async editSmallAnimal(
    customerEntity: CustomerEntity,
    petId: string,
    updateSmallAnimalRequest: UpdateSmallAnimalRequest,
  ): Promise<SuccessModel> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
    });
    if (!petEntity) {
      throw new NotFoundException('pet was not found!');
    }

    petEntity.name = updateSmallAnimalRequest.name;
    petEntity.gender = updateSmallAnimalRequest.gender;
    petEntity.customer = Promise.resolve(customerEntity);
    petEntity.breed = updateSmallAnimalRequest.breed || null;

    await this.petRepository.save(petEntity);

    await this.petRepository.updateVeterinarianBulk(
      petEntity,
      updateSmallAnimalRequest.veterinarians,
    );
    await this.petRepository.saveMedication(petEntity, {
      notes: updateSmallAnimalRequest.medicalNotes,
    });

    return new SuccessModel();
  }

  async setPetAvatar(
    customerEntity: CustomerEntity,
    petId: string,
    avatar: FileLib,
  ): Promise<SuccessModel> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId, customer: { id: customerEntity.id } },
      join: {
        alias: 'pet',
        leftJoin: { customer: 'pet.customer' },
      },
    });

    if (!petEntity) {
      throw new NotFoundException('pet not found or pet is not your');
    }

    const avatarFileEntity: PhotoEntity = await this.awsS3Lib.upload(
      avatar,
      FolderEnum.PET_PHOTO,
    );

    await this.petRepository.setAvatar(
      petEntity,
      avatarFileEntity,
      async (oldPhotoEntity: PhotoEntity | undefined) => {
        if (oldPhotoEntity) {
          await this.eventEmitter.emitAsync('photo.delete', oldPhotoEntity);
        }
      },
    );

    return new SuccessModel();
  }

  async getVaccination(
    customerEntity: CustomerEntity,
    petId: string,
  ): Promise<GetVaccinationResponse> {
    const petEntity = await this.petRepository.findOne({
      where: { id: petId, customer: customerEntity.id },
      relations: ['vaccinations', 'vaccinations.photo'],
    });
    if (!petEntity) {
      throw new NotFoundException('Pet was not found');
    }
    const vaccinationEntities = await petEntity.vaccinations;
    const vaccinationViewModelsPromises = vaccinationEntities.map(
      (vaccination) => makeVaccinationViewModel(vaccination),
    );
    const vaccinationViewModels = await Promise.all(
      vaccinationViewModelsPromises,
    );

    return { items: vaccinationViewModels };
  }

  async addVaccinations(
    customerEntity: CustomerEntity,
    petId: string,
    vaccinations: Array<FileLib>,
  ): Promise<SuccessModel> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId, customer: customerEntity.id },
      loadRelationIds: { relations: ['customer'] },
    });

    if (!petEntity) {
      throw new NotFoundException('pet not found or pet is not your');
    }

    const uploadVaccinationPromises = vaccinations.map((vaccinationFile) =>
      this.awsS3Lib.upload(vaccinationFile, FolderEnum.VACCINATIONS),
    );

    for await (const vaccinationPhotoEntity of uploadVaccinationPromises) {
      await this.petRepository.addVaccination(
        petEntity,
        vaccinationPhotoEntity,
      );
    }

    return new SuccessModel();
  }

  async deleteVaccination(
    customerEntity: CustomerEntity,
    petId: string,
    vaccinationId: string,
  ): Promise<SuccessModel> {
    await this.petRepository.deleteVaccination(
      { customerId: customerEntity.id, petId, vaccinationId },
      async (photoEntity) => {
        await this.eventEmitter.emitAsync('photo.delete', photoEntity);
      },
    );
    return new SuccessModel();
  }

  async getPetsForOrder(
    customerEntity: CustomerEntity,
    getForOrderRequest: GetForOrderRequest,
  ): Promise<GetForOrderResponse> {
    const serviceEntity:
      | ServiceEntity
      | undefined = await this.serviceRepository.findOne(
      getForOrderRequest.serviceId,
    );
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }

    // TODO: add check size type of service

    const visits = getForOrderRequest.visits.map((item) =>
      DateTime.fromMillis(item.time),
    );

    const visitByDate: Array<{ dateFrom: DateTime; dateTo: DateTime }> = [];

    for (const date of getForOrderRequest.onDates) {
      for (const visit of visits) {
        const dateFrom = DateTime.fromMillis(date).set({
          hour: visit.hour,
          minute: visit.minute,
          second: visit.second,
          millisecond: 0,
        });
        const dateTo = dateFrom.plus({ minute: serviceEntity.sumDuration });

        visitByDate.push({ dateFrom, dateTo });
      }
    }

    const speciesTypeEntities = await serviceEntity.forSpeciesTypes;
    const speciesTypes = speciesTypeEntities.map((type) => type.petType);
    const petsForNewOrder = await this.petRepository.findPetsForOrder(
      customerEntity.id,
      visitByDate,
      speciesTypes,
    );

    const petResponseItems = new Array<OrderPetItem>(petsForNewOrder.length);
    for (let i = 0; i < petsForNewOrder.length; i++) {
      const petPhoto = await petsForNewOrder[i].photo;

      const petForNewOrderItem: OrderPetItem = {
        id: petsForNewOrder[i].id,
        name: petsForNewOrder[i].name,
        breed: petsForNewOrder[i].breed,
        imageUrl: petPhoto?.url,
      };

      petResponseItems[i] = petForNewOrderItem;
    }

    return { items: petResponseItems };
  }

  async deletePet(
    customerEntity: CustomerEntity,
    petId: string,
  ): Promise<SuccessModel> {
    const petEntity = await this.petRepository.findOne({
      where: { id: petId, customer: customerEntity.id },
      relations: ['photo', 'vaccinations', 'vaccinations.photo'],
    });
    if (!petEntity) {
      throw new NotFoundException('Pet was not found!');
    }

    const hasActiveMainOrder = await this.mainOrderRepository.petHasActiveMainOrder(
      petEntity.id,
    );
    if (hasActiveMainOrder) {
      throw new BadRequestException(
        'Unfortunately, you have the order assigned to the pet. Operation is aborted.',
      );
    }

    const statusChanged = await this.mainOrderRepository.find({
      where: {
        status: MainOrderStatusEnum.CANCELED && MainOrderStatusEnum.COMPLETED,
      },
    });
    if (statusChanged) {
      petEntity.isActive = false;
      await this.petRepository.save(petEntity);
      return new SuccessModel();
    }
    const petPhoto = await petEntity.photo;
    const vaccinations = await petEntity.vaccinations;
    const vaccinationPhotoEntities = vaccinations.map(
      async (vaccination) => vaccination.photo,
    );

    this.eventEmitter
      .emitAsync('photo.delete', petPhoto)
      .catch((err) => console.error(err));
    for await (const vaccinationPhoto of vaccinationPhotoEntities) {
      this.eventEmitter
        .emitAsync('photo.delete', vaccinationPhoto)
        .catch((err) => console.error(err));
    }

    await this.petRepository.remove(petEntity);
    return new SuccessModel();
  }
}
