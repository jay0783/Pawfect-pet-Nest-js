import { MigrationInterface, QueryRunner } from 'typeorm';

const restrictions = [
  {
    id: '0c805c7e-8b94-4b09-9677-23614ce0b0dd',
    title: 'maximum',
    months: 5,
    hours: 0,
    minutes: 0,
  },
  {
    id: 'd4a118bd-7fd0-4741-b3fc-d09eaffadbd8',
    title: 'minimum',
    months: 0,
    hours: 23,
    minutes: 59,
  },
];

const timeBlocks = [
  {
    id: '974c9a74-4b6a-46d3-a3f6-e3dfd54bd3b5',
    title: 'morning',
    timeFrom: '2022-11-07 07:00:00',
    timeTo: '2022-11-07 11:00:00',
  },
  {
    id: '5c468480-4bb5-414b-9742-09e8ee73b67c',
    title: 'afternoon',
    timeFrom: '2022-11-07 12:00:00',
    timeTo: '2022-11-07 15:00:00',
  },
  {
    id: '01feb5b8-010c-4667-b80b-7c23c5874ae6',
    title: 'evening',
    timeFrom: '2022-11-07 18:00:00',
    timeTo: '2022-11-07 20:00:00',
  },
];

export class settings1667557108298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const restriction of restrictions) {
      await queryRunner.query(
        'INSERT INTO "BookingRestrictions"("id", "title", "months", "hours", "minutes") VALUES ($1, $2, $3, $4, $5)',
        [
          restriction.id,
          restriction.title,
          restriction.months,
          restriction.hours,
          restriction.minutes,
        ],
      );
    }
    for (const timeblock of timeBlocks) {
      await queryRunner.query(
        'INSERT INTO "TimeBlocks"("id", "title", "timeFrom", "timeTo") VALUES ($1, $2, $3, $4)',
        [timeblock.id, timeblock.title, timeblock.timeFrom, timeblock.timeTo],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const restriction of restrictions) {
      await queryRunner.query(
        'DELETE FROM "BookingRestrictions" WHERE "id" = $1',
        [restriction.id],
      );
    }
    for (const timeblock of timeBlocks) {
      await queryRunner.query('DELETE FROM "TimeBlocks" WHERE "id" = $1', [
        timeblock.id,
      ]);
    }
  }
}
