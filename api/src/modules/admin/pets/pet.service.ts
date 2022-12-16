import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { AwsS3Lib, FileLib, FolderEnum } from '@pawfect/libs/aws-s3';
import {
  PetRepository,
  CustomerRepository,
  MainOrderRepository,
} from '@pawfect/db/repositories';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  makePetProfileResponse,
  makeVaccinationViewModel,
  PetProfileResponse,
  PetItemListResponse,
  UpdateDogRequest,
  UpdateCatRequest,
  UpdateSmallAnimalRequest,
  AddSmallPetRequest,
  AddDogRequest,
  AddCatRequest,
  AddPetResponse,
} from './models';
import { PaginationResponse, SuccessModel } from '@pawfect/models';
import { PetEntity, PhotoEntity, CustomerEntity } from '@pawfect/db/entities';
import { GetVaccinationResponse } from 'src/modules/customer/pets/models/get-vaccination.response';
import { MainOrderStatusEnum } from '@pawfect/db/entities/enums';

@Injectable()
export class PetService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly awsS3Lib: AwsS3Lib,
    private readonly eventEmitter: EventEmitter2,
    private readonly mainOrderRepository: MainOrderRepository,
  ) {}

  async getPetProfile(petId: string): Promise<PetProfileResponse> {
    const pet: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
      relations: [
        'medication',
        'veterinarians',
        'vaccinations',
        'dogInfo',
        'catInfo',
        'photo',
      ],
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return makePetProfileResponse(pet);
  }

  async getVaccination(petId: string): Promise<GetVaccinationResponse> {
    const petEntity = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['vaccinations', 'vaccinations.photo'],
    });
    console.log('--------------------------');

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

  async getAllPets(
    customerId: string,
    paginationOpt: IPaginationOptions,
  ): Promise<PaginationResponse<PetItemListResponse>> {
    const paginatePetEntities: Pagination<PetEntity> = await this.petRepository.getAllAsCustomer(
      customerId,
      paginationOpt,
    );

    const petItems: Array<PetItemListResponse> = [];
    for (const petEntity of paginatePetEntities.items) {
      const petItem: PetItemListResponse = {
        id: petEntity.id,
        name: petEntity.name,
        type: petEntity.type,
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

  async setPetAvatar(petId: string, avatar: FileLib): Promise<SuccessModel> {
    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId },
      join: { alias: 'pet', leftJoin: { customer: 'pet.customer' } },
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

  async editDog(
    customerId: string,
    petId: string,
    updateDogRequest: UpdateDogRequest,
  ): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);

    if (!customerEntity) {
      throw new InternalServerErrorException('customer entity not found!');
    }

    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId, customer: customerEntity.id },
      relations: ['customer'],
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
    customerId: string,
    petId: string,
    updateCatRequest: UpdateCatRequest,
  ): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);

    if (!customerEntity) {
      throw new InternalServerErrorException('customer entity not found!');
    }

    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId, customer: customerEntity.id },
      relations: ['customer'],
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
    customerId: string,
    petId: string,
    updateSmallAnimalRequest: UpdateSmallAnimalRequest,
  ): Promise<SuccessModel> {
    const customerEntity:
      | CustomerEntity
      | undefined = await this.customerRepository.findOne(customerId);

    if (!customerEntity) {
      throw new InternalServerErrorException('customer entity not found!');
    }

    const petEntity: PetEntity | undefined = await this.petRepository.findOne({
      where: { id: petId, customer: customerEntity.id },
      relations: ['customer'],
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

  async addDog(
    customerId: string,
    addDogRequest: AddDogRequest,
  ): Promise<AddPetResponse> {
    const customerEntity = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new NotFoundException('customer entity not found!');
    }
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
    // await this.petRepository.saveMedication(newPetEntity, {
    //   requirements: addDogRequest.medicalRequirements,
    //   notes: addDogRequest.medicalNotes,
    // });

    const petItemListResponse: AddPetResponse = {
      id: newPetEntity.id,
    };

    return petItemListResponse;
  }

  async addCat(
    customerId: string,
    addCatRequest: AddCatRequest,
  ): Promise<AddPetResponse> {
    const customerEntity = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new NotFoundException('customer entity not found!');
    }

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
    // await this.petRepository.saveMedication(newPetEntity, {
    //   requirements: addCatRequest.medicalRequirements,
    //   notes: addCatRequest.medicalNotes,
    // });

    const petItemListResponse: AddPetResponse = {
      id: newPetEntity.id,
    };

    return petItemListResponse;
  }

  async addSmallAnimal(
    customerId: string,
    addSmallAnimalRequest: AddSmallPetRequest,
  ): Promise<AddPetResponse> {
    const customerEntity = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new NotFoundException('customer entity not found!');
    }

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
    // await this.petRepository.saveMedication(newPetEntity, {
    //   notes: addSmallAnimalRequest.medicalNotes,
    // });

    const petItemListResponse: AddPetResponse = {
      id: newPetEntity.id,
    };

    return petItemListResponse;
  }

  async deletePet(customerId: string, petId: string): Promise<SuccessModel> {
    const customerEntity = await this.customerRepository.findOne(customerId);
    if (!customerEntity) {
      throw new NotFoundException('customer entity not found!');
    }
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
        'Unfortunately, you have the order assigned to the pet.',
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
