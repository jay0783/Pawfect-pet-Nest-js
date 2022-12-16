import { MigrationInterface, QueryRunner } from 'typeorm';

const categories = [
  { id: '80e672c9-110c-4f51-b748-8ee45ac88a3f', name: 'Home Services' },
  { id: '5620f092-e639-48b8-9146-ffd701db0821', name: 'Boarding Services' },
  // { id: "5ce575ff-18d9-41ca-b400-4fd4c1db02bf", name: "Pet Taxi" }
  // { id: '854f6c8b-cb8f-41e3-89c7-6a88fd329043', name: 'Extras' },
];

export class InitCategory1611757683551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const category of categories) {
      await queryRunner.query(
        'INSERT INTO "Categories"("id", "name") VALUES ($1, $2)',
        [category.id, category.name],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const category of categories) {
      await queryRunner.query('DELETE FROM "Categories" WHERE "id" = $1', [
        category.id,
      ]);
    }
  }
}
