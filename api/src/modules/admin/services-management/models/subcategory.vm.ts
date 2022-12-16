import { SubcategoryEntity } from '@pawfect/db/entities';

export interface SubcategoryViewModel {
  id: string;
  name: string;
  imageUrl: string | null;
}

export async function makeSubcategoryViewModel(
  subcategory: SubcategoryEntity,
): Promise<SubcategoryViewModel> {
  const subcategoryLogo = await subcategory?.logo;

  return {
    id: subcategory.id,
    name: subcategory.name,
    imageUrl: subcategoryLogo?.url || null,
  };
}
