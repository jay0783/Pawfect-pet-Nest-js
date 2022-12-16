import { PetSizeEnum, PetSpeciesEnum } from '@pawfect/db/entities/enums';
import { ServiceEntity } from '@pawfect/db/entities';
import {
  makeSubcategoryViewModel,
  SubcategoryViewModel,
} from './subcategory.vm';

export interface CategoryServiceViewModel {
  id: string;
  title: string;
  duration: number;
  price: number;
  speciesType: PetSpeciesEnum[];
  forSizeType: PetSizeEnum;
  subcategory?: SubcategoryViewModel;
  checklist: string[];
  createdAt: number;
}

export async function makeServiceCategoryViewModel(
  serviceEntity: ServiceEntity,
): Promise<CategoryServiceViewModel> {
  const serviceSubcategory = await serviceEntity.subcategory;
  const serviceSpeciesTypes = await serviceEntity.forSpeciesTypes;
  const serviceSpeciesTypesViewModels = serviceSpeciesTypes.map(
    (petType) => petType.petType,
  );

  const serviceChecklist = await serviceEntity.checklist;

  const serviceChecklistView = serviceChecklist.map((serviceCheck) => {
    return { num: serviceCheck.numOrder, name: serviceCheck.name };
  });

  // Orders Listing in ASC
  let serviceChecklistViewModelsShort = serviceChecklistView.sort(function (
    a,
    b,
  ) {
    return a.num - b.num;
  });

  const serviceChecklistViewModels = serviceChecklistViewModelsShort.map(
    (serviceCheck) => serviceCheck.name,
  );

  const subcategoryViewModel = serviceSubcategory
    ? await makeSubcategoryViewModel(serviceSubcategory)
    : null;

  return <CategoryServiceViewModel>{
    id: serviceEntity.id,
    title: serviceEntity.title,
    duration: serviceEntity.sumDuration,
    price: serviceEntity.price,
    speciesType: serviceSpeciesTypesViewModels,
    forSizeType: serviceEntity.forPetSizeType,
    subcategory: subcategoryViewModel,
    checklist: serviceChecklistViewModels,
    createdAt: serviceEntity.createdAt.getTime(),
  };
}
