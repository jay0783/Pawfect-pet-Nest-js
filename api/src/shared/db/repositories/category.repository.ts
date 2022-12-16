import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from '../entities';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(readonly entityManager: EntityManager) {
    super();
  }

  async getCategoriesWithServicesAsCustomer(): Promise<Array<CategoryEntity>> {
    const query = this.createQueryBuilder('Categories')
      .where('Categories.status = :status', {
        status: true,
      })
      .leftJoinAndMapOne(
        'Categories.logo',
        'Photos',
        'CatPhotos',
        'Categories.logoId = CatPhotos.id',
      )
      .leftJoinAndMapMany(
        'Categories.services',
        'Services',
        'Services',
        'Categories.id = Services.categoryId',
      )
      .leftJoinAndMapOne(
        'Services.logo',
        'Photos',
        'SerPhotos',
        'Services.logoId = SerPhotos.id',
      )
      .leftJoinAndMapOne(
        'Services.subcategory',
        'Subcategories',
        'Subcategories',
        'Services.subcategoryId = Subcategories.id',
      )
      .leftJoinAndMapOne(
        'Subcategories.logo',
        'Photos',
        'SubCatPhotos',
        'Subcategories.logoId = SubCatPhotos.id',
      );

    return query.getMany();
  }
}
