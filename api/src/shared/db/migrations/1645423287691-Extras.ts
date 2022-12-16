import { MigrationInterface, QueryRunner } from 'typeorm';

const extras = [
  {
    id: 'cf27d65d-577b-4dae-8ffd-f405eed0cc9c',
    title: 'Key Pickup/Duplication Fee',
    description: 'Please pickup Key',
    price: 10,
  },
  {
    id: 'e5ab4be5-fbe4-4f14-b79b-be1a63062633',
    title: 'Plant Care/Water',
    description: 'Please water my plant',
    price: 20,
  },
  {
    id: '78ca3b0a-f454-4381-87a6-aad2dde901c8',
    title: 'Meet and greet',
    description:
      'Our goal is provide you with the info you need to desiced if a sitter is good fit',
    price: 20,
  },
];
export class Extra1645423287691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const extra of extras) {
      await queryRunner.query(
        'INSERT INTO "ExtraServices"("id", "title", "description", "price") VALUES ($1, $2, $3, $4)',
        [extra.id, extra.title, extra.description, extra.price],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const extra of extras) {
      await queryRunner.query('DELETE FROM "ExtraServices" WHERE "id" = $1', [
        extra.id,
      ]);
    }
  }
}
