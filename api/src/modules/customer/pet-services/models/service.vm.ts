import { PetSizeEnum, PetSpeciesEnum } from "@pawfect/db/entities/enums";
import { SubcategoryViewModel } from "./subcategory.vm";


export interface ServiceViewModel {
  id: string;
  title: string;
  description: string;
  speciesTypes: Array<PetSpeciesEnum>;
  sizeType?: PetSizeEnum | null;
  price: number;
  imageUrl?: string;
  subcategory?: SubcategoryViewModel;
}
