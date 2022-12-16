import { MigrationInterface, QueryRunner } from 'typeorm';

const admins = [
  {
    id: 'cf27d65d-577b-4dae-8ffd-f405eed0cc9c',
    email: 'admin@pawfect.com',
    passwordHash:
      '$2b$10$r2ntyAg7tYRJpKJN3vnXTeygIOBlc/OZ0LoX/3kAwmjzXz8GmW3aC',
  },
  {
    id: 'e5ab4be5-fbe4-4f14-b79b-be1a63062633',
    email: 'nayela@gmail.com',
    passwordHash:
      '$2b$10$r2ntyAg7tYRJpKJN3vnXTeygIOBlc/OZ0LoX/3kAwmjzXz8GmW3aC',
  },
  {
    id: '854f6c8b-cb8f-41e3-89c7-6a88fd329043',
    email: 'admin@gmail.com',
    passwordHash:
      '$2b$10$r2ntyAg7tYRJpKJN3vnXTeygIOBlc/OZ0LoX/3kAwmjzXz8GmW3aC',
  },
];
export class Admin1644817440589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const admin of admins) {
      await queryRunner.query(
        'INSERT INTO "Admins"("id", "email", "passwordHash") VALUES ($1, $2, $3)',
        [admin.id, admin.email, admin.passwordHash],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const admin of admins) {
      await queryRunner.query('DELETE FROM "Admins" WHERE "id" = $1', [
        admin.id,
      ]);
    }
  }
}
