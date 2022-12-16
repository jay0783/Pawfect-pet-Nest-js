import { MigrationInterface, QueryRunner } from "typeorm";


const serviceTypes = [
  { id: "12944ca0-224a-4294-93cf-066d541d8ca1", name: "Pet Sitting", categoryId: "80e672c9-110c-4f51-b748-8ee45ac88a3f" },
  { id: "a86aa750-a219-4923-bcd9-faacf8199103", name: "Dog Walking", categoryId: "80e672c9-110c-4f51-b748-8ee45ac88a3f" },
  { id: "1bd0695a-96ba-44fc-b31a-c62254c717c1", name: "Dog Boarding", categoryId: "5620f092-e639-48b8-9146-ffd701db0821" },
  { id: "bfb22486-5fed-4e31-87d6-1e5cad52a65d", name: "Dog Daycare", categoryId: "5620f092-e639-48b8-9146-ffd701db0821" }
];

export class InitSubcategory1611763018261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const serviceType of serviceTypes) {
      await queryRunner.query("INSERT INTO \"Subcategories\"(\"id\", \"name\", \"categoryId\") VALUES ($1, $2, $3)", [serviceType.id, serviceType.name, serviceType.categoryId]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const serviceType of serviceTypes) {
      await queryRunner.query("DELETE FROM \"Subcategories\" WHERE \"id\" = $1", [serviceType.id]);
    }
  }
}
