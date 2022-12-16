import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtraServiceEntity } from '@pawfect/db/entities';
import { CategoryEntity } from '@pawfect/db/entities/category.entity';
import { CategoryRepository } from '@pawfect/db/repositories';
import {
  CategoryViewModel,
  ExtraServiceViewModel,
  GetPetExtraServiceResponse,
  GetPetServiceResponse,
  ServiceViewModel,
} from './models';

@Injectable()
export class PetServiceService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(ExtraServiceEntity)
    private readonly extraServiceRepository: Repository<ExtraServiceEntity>,
  ) {}

  async getPetServices(): Promise<GetPetServiceResponse> {
    const categoryEntities: Array<CategoryEntity> = await this.categoryRepository.getCategoriesWithServicesAsCustomer();

    const categoryViewModels: Array<CategoryViewModel> = new Array<CategoryViewModel>();
    for (const categoryEntity of categoryEntities) {
      const logoEntity = await categoryEntity.logo;
      const categoryViewModel: CategoryViewModel = {
        id: categoryEntity.id,
        imageUrl: logoEntity?.url,
        title: categoryEntity.name,
        services: [],
      };

      const serviceEntities = await categoryEntity.services;
      for (const serviceEntity of serviceEntities) {
        const serviceLogoEntity = await serviceEntity.logo;
        const subcategoryEntity = await serviceEntity.subcategory;
        const subcategoryLogoEntity = await subcategoryEntity?.logo;
        const forSpeciesTypeEntities = await serviceEntity.forSpeciesTypes;
        const petServiceServiceModel: ServiceViewModel = {
          id: serviceEntity.id,
          title: serviceEntity.title,
          description: serviceEntity.description,
          speciesTypes: forSpeciesTypeEntities.map((i) => i.petType),
          sizeType: serviceEntity.forPetSizeType,
          price: serviceEntity.price,
          imageUrl: serviceLogoEntity?.url,
          subcategory: subcategoryEntity
            ? {
                id: subcategoryEntity.id,
                title: subcategoryEntity.name,
                imageUrl: subcategoryLogoEntity?.url,
              }
            : undefined,
        };

        categoryViewModel.services.push(petServiceServiceModel);
      }

      categoryViewModels.push(categoryViewModel);
    }

    return { items: categoryViewModels };
  }

  async getPetExtraServices(): Promise<GetPetExtraServiceResponse> {
    const extraServiceEntities = await this.extraServiceRepository.find({
      where: {
        status: true,
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

  async getExtraServices(): Promise<GetPetExtraServiceResponse> {
    const extraServiceEntities = await this.extraServiceRepository.find({
      join: { alias: 'extras', leftJoin: { logo: 'extras.logo' } },
    });

    const extraServiceResponse: GetPetExtraServiceResponse = { items: [] };
    for (const extraService of extraServiceEntities) {
      const logoEntity = await extraService.logo;
      const same = 'MEETANDGREET';
      const stringReplace = extraService.title.replace(/ /g, '');
      var areEqual = same.toUpperCase() === stringReplace.toUpperCase();

      if (areEqual) {
        const extraServiceItem: ExtraServiceViewModel = {
          id: extraService.id,
          title: extraService.title,
          description: extraService.description,
          price: extraService.price,
          imageUrl: logoEntity?.url,
        };
        extraServiceResponse.items.push(extraServiceItem);
      }
    }
    return extraServiceResponse;
  }
}
