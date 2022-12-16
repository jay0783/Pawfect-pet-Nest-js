import { EntityManager, In, Not, Like, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CategoryRepository,
  ExtraServiceRepository,
  ServiceCheckRepository,
  ServiceRepository,
  ServicePetRepository,
  SubcategoryRepository,
} from '@pawfect/db/repositories';
import {
  ExtraServiceEntity,
  PhotoEntity,
  ServiceEntity,
  ServicePetTypeEntity,
  SubcategoryEntity,
} from '@pawfect/db/entities/index';

import { SuccessModel } from '@pawfect/models';
import { ServiceCheckEntity } from '@pawfect/db/entities';
import { TransactionManager } from '@pawfect/db/services';
import {
  GetAllServicesResponse,
  GetServiceDetailsResponse,
  UpdateServiceRequest,
  makeServiceCategoryViewModel,
  makeServiceCheckViewModel,
  GetPetExtraServiceResponse,
  ExtraServiceViewModel,
  UpdateServiceChecklistRequest,
  AddServiceRequest,
  AddServiceChecklistRequest,
  checklistRequest,
  AddExtraServiceRequest,
} from './models';
import { KinesisVideoSignalingChannels } from 'aws-sdk';
import { PetSpeciesEnum } from '@pawfect/db/entities/enums';

@Injectable()
export class ServiceManagementService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly serviceCheckRepository: ServiceCheckRepository,
    private readonly appTransactionManager: TransactionManager,
    private readonly extraRepository: ExtraServiceRepository,
    private readonly servicePetRepository: ServicePetRepository,
    private readonly subcategoryRepository: SubcategoryRepository,
  ) {}

  async getServiceDetails(
    serviceId: string,
  ): Promise<GetServiceDetailsResponse> {
    const serviceEntity = await this.serviceRepository.findOne({
      where: { id: serviceId },
      relations: ['forSpeciesTypes', 'checklist'],
    });
    //

    if (!serviceEntity) {
      throw new NotFoundException('Service not found');
    }

    const servicePetTypes = await serviceEntity.forSpeciesTypes;
    const servicePetTypeViewModels = servicePetTypes.map(
      (petType) => petType.petType,
    );

    const serviceChecklist = await serviceEntity.checklist;
    // const serviceCheckNonBLocked = serviceChecklist
    //   .map((checkEntity) => {
    //     if (checkEntity.blocked == false) {
    //       return checkEntity;
    //     }
    //   })
    //   .filter((checkEntity) => checkEntity !== undefined);

    const serviceChecklistViewModels = serviceChecklist.map((checkEntity) =>
      makeServiceCheckViewModel(checkEntity),
    );

    return {
      id: serviceEntity.id,
      title: serviceEntity.title,
      price: serviceEntity.price,
      duration: serviceEntity.sumDuration,
      forSpeciesTypes: servicePetTypeViewModels,
      description: serviceEntity.description,
      checklist: serviceChecklistViewModels,
    };
  }

  async getAllServices(): Promise<GetAllServicesResponse> {
    const categoriesEntities = await this.categoryRepository.find({
      where: { name: Not('Pet Taxi') },
      relations: [
        'logo',
        'services',
        'services.checklist',
        'services.forSpeciesTypes',
        'services.subcategory',
        'services.subcategory.logo',
      ],
    });

    const categoriesViewModelsPromises = categoriesEntities.map(
      async (categoryEntity) => {
        const categoryLogo = await categoryEntity.logo;
        const categoryServicesUnfiltered = await categoryEntity.services;
        console.log(
          'categoryServicesUnfiltered: ===>>>',
          categoryServicesUnfiltered,
        );

        const categoryServices = new Array();
        for (let service of categoryServicesUnfiltered) {
          //filtering all the services which are not deleted
          if (service.isDeleted === false) {
            categoryServices.push(service);
          } else {
            continue;
          }
        }

        const categoryServicesViewModelsPromises = categoryServices.map(
          (categoryEntity) => makeServiceCategoryViewModel(categoryEntity),
        );
        const categoryServicesViewModels = await Promise.all(
          categoryServicesViewModelsPromises,
        );

        const sortedcategoryServicesViewModels = categoryServicesViewModels.sort(
          (a, b) => {
            return a.createdAt - b.createdAt;
          },
        );

        // const sortedcategoryServicesViewModels = categoryServicesViewModels.sort(
        //   function (a, b) {
        //     return ('' + a.title).localeCompare(b.title);
        //   },
        // );

        return {
          id: categoryEntity.id,
          name: categoryEntity.name,
          imageUrl: categoryLogo?.url || null,
          services: sortedcategoryServicesViewModels,
        };
      },
    );

    const categoriesEntitiesViewModels = await Promise.all(
      categoriesViewModelsPromises,
    );

    return { items: categoriesEntitiesViewModels };
  }

  async updateService(
    serviceId: string,
    updateServiceRequest: UpdateServiceRequest,
  ): Promise<SuccessModel> {
    const serviceEntity = await this.serviceRepository.findOne(serviceId, {
      relations: ['forSpeciesTypes'],
    });
    if (!serviceEntity) {
      throw new NotFoundException('Service not found');
    }

    serviceEntity.title = updateServiceRequest.title;
    serviceEntity.price = updateServiceRequest.price;
    serviceEntity.type = updateServiceRequest.type;
    serviceEntity.description = updateServiceRequest.description;
    serviceEntity.sumDuration = updateServiceRequest.duration;

    await this.serviceRepository.save(serviceEntity);
    await this.serviceRepository.updateServiceSpeciesTypes(
      serviceEntity,
      updateServiceRequest.forSpeciesTypes,
    );

    return new SuccessModel();
  }

  async addServiceCheckList(
    serviceId: string,
    addChecklistRequest: AddServiceChecklistRequest,
  ): Promise<SuccessModel> {
    const serviceEntity:
      | ServiceEntity
      | undefined = await this.serviceRepository.findOne(serviceId);
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }

    const lastChecklistEntity:
      | ServiceCheckEntity
      | undefined = await this.serviceCheckRepository.findOne({
      where: {
        service: serviceEntity.id,
        blocked: false,
      },
      order: { numOrder: 'DESC' },
    });

    const lastNumOrder: number = lastChecklistEntity?.numOrder || 1;
    const futureNumOrder: number = lastNumOrder + 1;

    await this.serviceCheckRepository.shiftNumOrder(
      serviceId,
      futureNumOrder,
      1,
    );

    const serviceCheckEntity: ServiceCheckEntity = new ServiceCheckEntity();
    serviceCheckEntity.name = addChecklistRequest.name;
    serviceCheckEntity.duration = addChecklistRequest.duration;
    serviceCheckEntity.numOrder = futureNumOrder;
    serviceCheckEntity.service = Promise.resolve(serviceEntity);

    await this.serviceCheckRepository.save(serviceCheckEntity);

    serviceEntity.price = 50;
    serviceEntity.sumDuration = serviceEntity.sumDuration + 10;
    await this.serviceRepository.save(serviceEntity);

    return new SuccessModel();
  }

  async updateServiceCheckList(
    serviceId: string,
    serviceCheckId: string,
    updateServiceChecklistRequest: UpdateServiceChecklistRequest,
  ): Promise<SuccessModel> {
    const serviceEntity = await this.serviceRepository.findOne(serviceId);
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }

    const updatedChecklistEntity = await this.serviceCheckRepository.findOne({
      where: {
        id: serviceCheckId,
        service: serviceId,
        // blocked: false,
      },
    });
    if (!updatedChecklistEntity) {
      throw new NotFoundException('Service Check was not found!');
    }

    serviceEntity.sumDuration -= updatedChecklistEntity.duration;
    serviceEntity.sumDuration += updateServiceChecklistRequest.duration;
    await this.serviceRepository.save(serviceEntity);

    updatedChecklistEntity.name = updateServiceChecklistRequest.name;
    updatedChecklistEntity.duration = updateServiceChecklistRequest.duration;
    // updatedChecklistEntity.blocked = updateServiceChecklistRequest.blocked;
    await this.serviceCheckRepository.save(updatedChecklistEntity);

    return new SuccessModel();
  }

  async deleteServiceCheckList(
    serviceId: string,
    checklistId: string,
  ): Promise<SuccessModel> {
    const serviceEntity = await this.serviceRepository.findOne(serviceId);
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }

    const deletedCheckEntity = await this.serviceCheckRepository.findOne({
      where: {
        id: checklistId,
        service: serviceEntity.id,
        blocked: false,
      },
    });

    if (!deletedCheckEntity) {
      throw new NotFoundException('Check was not found!');
    }

    const deletedNumOrder = deletedCheckEntity.numOrder;

    serviceEntity.sumDuration -= deletedCheckEntity.duration;
    await this.serviceRepository.save(serviceEntity);

    await this.serviceCheckRepository.shiftNumOrder(
      serviceId,
      deletedNumOrder,
      -1,
    );
    await this.serviceCheckRepository.remove(deletedCheckEntity);

    return new SuccessModel();
  }

  async deleteService(serviceId: string): Promise<SuccessModel> {
    const serviceEntity = await this.serviceRepository.findOne(serviceId);
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }
    await this.serviceRepository.remove(serviceEntity);
    return new SuccessModel();
  }

  async softDeleteService(serviceId: string): Promise<SuccessModel> {
    const serviceEntity = await this.serviceRepository.findOne(serviceId);
    if (!serviceEntity) {
      throw new NotFoundException('Service was not found!');
    }
    serviceEntity.isDeleted = true;
    await this.serviceRepository.save(serviceEntity);
    return new SuccessModel();
  }

  async deleteCategory(categoryId: string): Promise<SuccessModel> {
    const categoryEntity = await this.categoryRepository.findOne(categoryId);

    if (!categoryEntity) {
      throw new NotFoundException('Category was not found!');
    }
    categoryEntity.status = false;
    await this.categoryRepository.save(categoryEntity);
    return new SuccessModel();
  }

  async deleteExtras(extraId: string): Promise<SuccessModel> {
    const extraEntity = await this.extraRepository.findOne(extraId);

    if (!extraEntity) {
      throw new NotFoundException('Extra Service was not found!');
    }
    extraEntity.status = false;
    await this.extraRepository.save(extraEntity);
    return new SuccessModel();
  }

  async getPetExtraServices(): Promise<GetPetExtraServiceResponse> {
    const extraServiceEntities = await this.extraRepository.find({
      where: {
        status: true,
        title: Not('Meet and greet'),
      },
      join: { alias: 'extras', leftJoin: { logo: 'extras.logo' } },
    });

    const extraServiceResponse: GetPetExtraServiceResponse = { items: [] };
    for (const extraService of extraServiceEntities) {
      const logoEntity = await extraService.logo;
      const extraServiceItem: ExtraServiceViewModel = {
        id: extraService.id,
        title: extraService.title,
        description: extraService.description,
        price: extraService.price,
        imageUrl: logoEntity?.url,
      };

      extraServiceResponse.items.push(extraServiceItem);
    }

    return extraServiceResponse;
  }
  async meetAndGreetExtraServices(): Promise<GetPetExtraServiceResponse> {
    const extraServiceEntities = await this.extraRepository.find({
      where: {
        title: Like('Meet and greet'),
      },
      join: { alias: 'extras', leftJoin: { logo: 'extras.logo' } },
    });

    const extraServiceResponse: GetPetExtraServiceResponse = { items: [] };
    for (const extraService of extraServiceEntities) {
      const logoEntity = await extraService.logo;
      const extraServiceItem: ExtraServiceViewModel = {
        id: extraService.id,
        title: extraService.title,
        description: extraService.description,
        price: extraService.price,
        imageUrl: logoEntity?.url,
      };

      extraServiceResponse.items.push(extraServiceItem);
    }

    return extraServiceResponse;
  }

  async getServicesForSpecies(type: string): Promise<Array<ServiceEntity>> {
    const services:
      | Array<ServiceEntity>
      | undefined = await this.serviceRepository.find({
      where: {
        type: type,
        isDeleted: false,
      },
    });
    // console.log('services: ===>>>', services);
    return services;
  }

  async addServicePetType(
    petTypes: Array<PetSpeciesEnum>,
    serviceEntity: ServiceEntity,
  ): Promise<Boolean | undefined> {
    try {
      for (let i = 0; i < petTypes.length; i++) {
        const servicePetEntity: ServicePetTypeEntity = new ServicePetTypeEntity();
        servicePetEntity.petType = petTypes[i];
        servicePetEntity.service = Promise.resolve(serviceEntity);
        this.servicePetRepository.save(servicePetEntity);
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  async addChecklist(
    checklists: Array<checklistRequest>,
    serviceEntity: ServiceEntity,
  ): Promise<Boolean | undefined> {
    try {
      // const serviceCheckEntities = new Array<ServiceCheckEntity>();
      for (let i = 0; i < checklists.length; i++) {
        const serviceCheckEntity: ServiceCheckEntity = new ServiceCheckEntity();
        serviceCheckEntity.name = checklists[i].name;
        serviceCheckEntity.duration = checklists[i].duration;
        serviceCheckEntity.numOrder = i + 1;
        serviceCheckEntity.blocked = false;
        serviceCheckEntity.service = Promise.resolve(serviceEntity);
        this.serviceCheckRepository.save(serviceCheckEntity);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  async addService(
    addServiceRequest: AddServiceRequest,
  ): Promise<ServiceEntity | undefined> {
    try {
      const serviceEntity: ServiceEntity = new ServiceEntity();
      serviceEntity.title = addServiceRequest.title;
      serviceEntity.price = addServiceRequest.price;
      serviceEntity.type = addServiceRequest.type;
      serviceEntity.description = addServiceRequest.description;
      serviceEntity.sumDuration = addServiceRequest.duration;
      serviceEntity.category = Promise.resolve(addServiceRequest.categoryId);
      serviceEntity.subcategory = Promise.resolve(
        addServiceRequest.subcategoryId,
      );
      await this.serviceRepository.save(serviceEntity);

      const createChecklist: Boolean | undefined = await this.addChecklist(
        addServiceRequest.checklists,
        serviceEntity,
      );
      if (!createChecklist) {
        throw new InternalServerErrorException('Something went wrong !');
      }
      const servicePets: Boolean | undefined = await this.addServicePetType(
        addServiceRequest.forSpeciesTypes,
        serviceEntity,
      );
      if (!servicePets) {
        throw new InternalServerErrorException('Something went wrong !');
      }
      return serviceEntity;
    } catch (err) {}
  }

  async getSubcategories(
    categoryId: string,
  ): Promise<Array<SubcategoryEntity>> {
    const subcategories: Array<SubcategoryEntity> = await this.subcategoryRepository.find(
      {
        where: {
          category: categoryId,
        },
      },
    );
    return subcategories;
  }

  async addExtraService(
    addExtraServiceRequest: AddExtraServiceRequest,
  ): Promise<SuccessModel> {
    const extraServiceEntity: ExtraServiceEntity = new ExtraServiceEntity();
    extraServiceEntity.title = addExtraServiceRequest.title;
    extraServiceEntity.description = addExtraServiceRequest.description;
    extraServiceEntity.price = addExtraServiceRequest.price;
    await this.extraRepository.save(extraServiceEntity);

    return new SuccessModel();
  }

  async editExtraService(
    editExtraServiceRequest: AddExtraServiceRequest,
    extraId: string,
  ): Promise<SuccessModel> {
    const extraServiceEntity:
      | ExtraServiceEntity
      | undefined = await this.extraRepository.findOne(extraId);
    if (!extraServiceEntity) {
      throw new NotFoundException('Extra service not found');
    }
    // const extraServiceEntity: ExtraServiceEntity = new ExtraServiceEntity();
    extraServiceEntity.title = editExtraServiceRequest.title;
    extraServiceEntity.description = editExtraServiceRequest.description;
    extraServiceEntity.price = editExtraServiceRequest.price;
    await this.extraRepository.save(extraServiceEntity);

    return new SuccessModel();
  }

  async getExtraService(extraId: string): Promise<ExtraServiceViewModel> {
    const extraServiceEntity:
      | ExtraServiceEntity
      | undefined = await this.extraRepository.findOne(extraId);
    if (!extraServiceEntity) {
      throw new NotFoundException('Extra service not found');
    }

    const extraServiceViewModel: ExtraServiceViewModel = {
      id: extraServiceEntity.id,
      title: extraServiceEntity.title,
      description: extraServiceEntity.description,
      price: extraServiceEntity.price,
    };

    return extraServiceViewModel;
  }

  async deleteExtraService(extraId: string): Promise<SuccessModel> {
    const extraServiceEntity:
      | ExtraServiceEntity
      | undefined = await this.extraRepository.findOne(extraId);
    if (!extraServiceEntity) {
      throw new NotFoundException('Extra service not found');
    }
    await this.extraRepository.remove(extraServiceEntity);
    return new SuccessModel();
  }

  // async meetAndGreetExtraServices(): Promise<ExtraServiceViewModel> {
  //   const extraService:
  //     | ExtraServiceEntity
  //     | undefined = await this.extraRepository.findOne({
  //     where: {
  //       title: Like('Meet and greet'),
  //     },
  //     join: { alias: 'extras', leftJoin: { logo: 'extras.logo' } },
  //   });

  //   if (!extraService) {
  //     throw new NotFoundException('Extra Service not found');
  //   }
  //   const logoEntity: PhotoEntity | null | undefined = await extraService?.logo;
  //   // const extraServiceResponse: GetPetExtraServiceResponse = { items: [] };

  //   const extraServiceItem: ExtraServiceViewModel = {
  //     id: extraService.id,
  //     title: extraService.title,
  //     description: extraService.description,
  //     price: extraService.price,
  //     imageUrl: logoEntity?.url,
  //   };

  //   return extraServiceItem;
  // }
}
