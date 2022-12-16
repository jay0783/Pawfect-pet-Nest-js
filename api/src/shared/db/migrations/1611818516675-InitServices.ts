import { MigrationInterface, QueryRunner } from 'typeorm';
import { PetSizeEnum } from '../entities/pet/enums/pet-size.enum';

const services = [
  {
    id: '9e7509f0-1f4f-4192-88d2-a03b0ef23264',
    title: 'Daily Check Ins',
    shortDescription: 'Daily Check Ins Dog ...',
    duration: 30,
    price: 25,
    subcategoryId: '12944ca0-224a-4294-93cf-066d541d8ca1',
    categoryId: '80e672c9-110c-4f51-b748-8ee45ac88a3f',
    forPetSizeType: null,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: '8d35ea11-1dbd-4f54-ae1b-6ce6627cd1ec',
    title: 'Daily Check Ins',
    shortDescription: 'Daily Check Ins Cat ...',
    duration: 30,
    price: 20,
    subcategoryId: '12944ca0-224a-4294-93cf-066d541d8ca1',
    categoryId: '80e672c9-110c-4f51-b748-8ee45ac88a3f',
    forPetSizeType: null,
    servicePetTypes: ['cat'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: '1ebe74eb-c343-4892-bb6d-1a53823ee72d',
    title: 'Overnight Pet Sitting',
    shortDescription: 'Daily Check Ins For all pet',
    duration: 720,
    price: 120,
    subcategoryId: '12944ca0-224a-4294-93cf-066d541d8ca1',
    categoryId: '80e672c9-110c-4f51-b748-8ee45ac88a3f',
    forPetSizeType: null,
    servicePetTypes: ['cat', 'dog', 'small-animal'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },

  {
    id: '218d1194-0145-49e5-96df-1ce8a2fd842d',
    title: '20 Minute Dog Walk',
    shortDescription: '20 Minute Dog Walk..',
    duration: 20,
    price: 20,
    subcategoryId: 'a86aa750-a219-4923-bcd9-faacf8199103',
    categoryId: '80e672c9-110c-4f51-b748-8ee45ac88a3f',
    forPetSizeType: null,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: '1cd70db6-47e8-4925-962b-0644ad3ba956',
    title: '30 Minute Dog Walk',
    shortDescription: '30 Minute Dog Walk..',
    duration: 30,
    price: 30,
    subcategoryId: 'a86aa750-a219-4923-bcd9-faacf8199103',
    categoryId: '80e672c9-110c-4f51-b748-8ee45ac88a3f',
    forPetSizeType: null,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: '9743f27f-d88c-4e63-a143-1eb0a2ae1a15',
    title: '60 Minute Dog Walk',
    shortDescription: '60 Minute Dog Walk ..',
    duration: 60,
    price: 40,
    subcategoryId: 'a86aa750-a219-4923-bcd9-faacf8199103',
    categoryId: '80e672c9-110c-4f51-b748-8ee45ac88a3f',
    forPetSizeType: null,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },

  {
    id: 'a2a7fd6d-455d-4221-be3b-ae8c56c52830',
    title: 'Dog Boarding',
    shortDescription: 'Dog Boarding... small',
    duration: 0,
    price: 35,
    subcategoryId: '1bd0695a-96ba-44fc-b31a-c62254c717c1',
    categoryId: '5620f092-e639-48b8-9146-ffd701db0821',
    forPetSizeType: PetSizeEnum.small,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: '068ad6f9-dd97-498c-9a7a-435a8c11384e',
    title: 'Dog Boarding',
    shortDescription: 'Dog Boarding.. medium',
    duration: 0,
    price: 45,
    subcategoryId: '1bd0695a-96ba-44fc-b31a-c62254c717c1',
    categoryId: '5620f092-e639-48b8-9146-ffd701db0821',
    forPetSizeType: PetSizeEnum.medium,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: 'f7b0ce90-f2c5-4076-9b08-d2bc2c6425d4',
    title: 'Dog Boarding',
    shortDescription: 'Dog Boarding... large',
    duration: 0,
    price: 55,
    subcategoryId: '1bd0695a-96ba-44fc-b31a-c62254c717c1',
    categoryId: '5620f092-e639-48b8-9146-ffd701db0821',
    forPetSizeType: PetSizeEnum.large,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },

  {
    id: '5d512eb3-b24e-4449-9117-ec7ca8dd66c3',
    title: 'Dog Daycare',
    shortDescription: 'Dog Daycare... small',
    duration: 630,
    price: 30,
    subcategoryId: 'bfb22486-5fed-4e31-87d6-1e5cad52a65d',
    categoryId: '5620f092-e639-48b8-9146-ffd701db0821',
    forPetSizeType: PetSizeEnum.small,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: 'd7d5c608-382c-43cb-b4f9-f75b7d17be0b',
    title: 'Dog Daycare',
    shortDescription: 'Dog Daycare... medium',
    duration: 630,
    price: 40,
    subcategoryId: 'bfb22486-5fed-4e31-87d6-1e5cad52a65d',
    categoryId: '5620f092-e639-48b8-9146-ffd701db0821',
    forPetSizeType: PetSizeEnum.medium,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },
  {
    id: 'ad0376fd-75d7-475a-9029-222d1799b23e',
    title: 'Dog Daycare',
    shortDescription: 'Dog Daycare... large',
    duration: 630,
    price: 50,
    subcategoryId: 'bfb22486-5fed-4e31-87d6-1e5cad52a65d',
    categoryId: '5620f092-e639-48b8-9146-ffd701db0821',
    forPetSizeType: PetSizeEnum.large,
    servicePetTypes: ['dog'],
    checks: [
      { name: 'Test1', duration: 10, numOrder: 1 },
      { name: 'Test2', duration: 10, numOrder: 2 },
      { name: 'Test3', duration: 10, numOrder: 3 },
      { name: 'Test4', duration: 10, numOrder: 4 },
    ],
  },

  // {
  //   id: 'a768f867-a982-49b2-8c49-6f9b5237c97b',
  //   title: 'Cat Taxi',
  //   shortDescription: 'short desc',
  //   duration: 60,
  //   price: 30,
  //   subcategoryId: null,
  //   categoryId: '5ce575ff-18d9-41ca-b400-4fd4c1db02bf',
  //   forPetSizeType: null,
  //   servicePetTypes: ['cat'],
  //   checks: [
  //     { name: 'Test1', duration: 10, numOrder: 1 },
  //     { name: 'Test2', duration: 10, numOrder: 2 },
  //     { name: 'Test3', duration: 10, numOrder: 3 },
  //     { name: 'Test4', duration: 10, numOrder: 4 },
  //   ],
  // },
  // {
  //   id: '5fcfda09-eb74-4a95-8338-d008560d80f9',
  //   title: 'Dog Taxi',
  //   shortDescription: 'short desc',
  //   duration: 60,
  //   price: 45,
  //   subcategoryId: null,
  //   categoryId: '5ce575ff-18d9-41ca-b400-4fd4c1db02bf',
  //   forPetSizeType: null,
  //   servicePetTypes: ['dog'],
  //   checks: [
  //     { name: 'Test1', duration: 10, numOrder: 1 },
  //     { name: 'Test2', duration: 10, numOrder: 2 },
  //     { name: 'Test3', duration: 10, numOrder: 3 },
  //     { name: 'Test4', duration: 10, numOrder: 4 },
  //   ],
  // },

  // { id: 'cf27d65d-577b-4dae-8ffd-f405eed0cc9c', title: 'Key Pickup/Duplication Fee', shortDescription: 'short desc', duration: 0, price: 10, subcategoryId: null, categoryId: '854f6c8b-cb8f-41e3-89c7-6a88fd329043', forPetSizeType: null, servicePetTypes: ['dog', 'cat', 'small-animal'], checks: [{ name: 'Test1', duration: 10, numOrder: 1 }, { name: 'Test2', duration: 10, numOrder: 2 }, { name: 'Test3', duration: 10, numOrder: 3 }, { name: 'Test4', duration: 10, numOrder: 4 }] },
  // { id: 'e5ab4be5-fbe4-4f14-b79b-be1a63062633', title: 'Plant Care/Water', shortDescription: 'short desc', duration: 0, price: 20, subcategoryId: null, categoryId: '854f6c8b-cb8f-41e3-89c7-6a88fd329043', forPetSizeType: null, servicePetTypes: ['dog', 'cat', 'small-animal'], checks: [{ name: 'Test1', duration: 10, numOrder: 1 }, { name: 'Test2', duration: 10, numOrder: 2 }, { name: 'Test3', duration: 10, numOrder: 3 }, { name: 'Test4', duration: 10, numOrder: 4 }] },
  // { id: '78ca3b0a-f454-4381-87a6-aad2dde901c8', title: 'Meet and greet', shortDescription: 'short desc', duration: 0, price: 0, subcategoryId: null, categoryId: '854f6c8b-cb8f-41e3-89c7-6a88fd329043', forPetSizeType: null, servicePetTypes: ['dog', 'cat', 'small-animal'], checks: [{ name: 'Test1', duration: 10, numOrder: 1 }, { name: 'Test2', duration: 10, numOrder: 2 }, { name: 'Test3', duration: 10, numOrder: 3 }, { name: 'Test4', duration: 10, numOrder: 4 }] },
];

export class InitServices1611818516675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const service of services) {
      const { servicePetTypes, checks, ...serviceObj } = service;
      await queryRunner.query(
        'INSERT INTO "Services"("id", "title", "description", "sumDuration", "price", "subcategoryId", "categoryId", "forPetSizeType") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        Object.values(serviceObj),
      );
      for (const check of service.checks) {
        await queryRunner.query(
          'INSERT INTO "ServiceChecks"("id", "name", "duration", "numOrder", "serviceId") VALUES (uuid_generate_v4(), $1, $2, $3, $4)',
          [...Object.values(check), service.id],
        );
      }

      for (const petType of service.servicePetTypes) {
        await queryRunner.query(
          'INSERT INTO "ServicePetTypes"("id", "petType", "serviceId") VALUES (uuid_generate_v4(), $1, $2)',
          [petType, service.id],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const serviceType of services) {
      await queryRunner.query('DELETE FROM "Services" WHERE "id" = $1', [
        serviceType.id,
      ]);
    }
  }
}
