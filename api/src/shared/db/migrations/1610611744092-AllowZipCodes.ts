import { MigrationInterface, QueryRunner } from "typeorm";


const allowZipCodes: Array<{ id: string; zipCode: string; }> = [
  { id: "e97bf010-a149-4eb5-9a31-5737111853c0", zipCode: "85003" },
  { id: "f415e235-c563-4292-a70b-854ce8f68657", zipCode: "85006" },
  { id: "472e240c-5df8-46ea-b932-a8c8c535f7c2", zipCode: "85014" },
  { id: "ad552d23-5133-4bed-b509-46f382e3b893", zipCode: "85015" },
  { id: "a77fd32f-24d3-460d-a2e3-e15ab00b43fb", zipCode: "85016" },
  { id: "bbf113b0-6886-4a94-b848-2db16ca3cfe6", zipCode: "85017" },
  { id: "97a31ef1-8f8a-4b4d-b68c-905e560f1efc", zipCode: "85018" },
  { id: "ea745c5f-4056-47f8-8fc8-11761fee1738", zipCode: "85020" },
  { id: "75db0dcf-e019-4b1f-a332-951eea09979c", zipCode: "85021" },
  { id: "b2b810f4-35c5-44ab-9aa7-d0dc077ca4b5", zipCode: "85022" },
  { id: "3a237627-be2c-4cee-9a38-1547e018c0ec", zipCode: "85023" },
  { id: "394ee576-6346-4426-a163-8f7783afc34e", zipCode: "85024" },
  { id: "32154078-da2b-4544-b64b-86181a2b1dfa", zipCode: "85027" },
  { id: "dfb41a94-4388-45e4-9244-a23b021d85e9", zipCode: "85028" },
  { id: "ee490f2a-2bcc-4bbd-a3d0-46d6ff8d34f6", zipCode: "85029" },
  { id: "ef96e135-91ad-486d-b8e1-6c62578dfca8", zipCode: "85031" },
  { id: "56d482a7-67d2-4f90-8923-b53977163d70", zipCode: "85032" },
  { id: "937dba84-3d6e-4ddf-89f0-8d2b8377f7cc", zipCode: "85034" },
  { id: "4aeeee03-2a17-421e-ab36-8f676a59275b", zipCode: "85035" },
  { id: "d8aa0747-41c8-4b25-b42f-e9b78a3cd326", zipCode: "85050" },
  { id: "f55b511e-6f54-4923-9010-14e57d8e3b4b", zipCode: "85051" },
  { id: "a634d827-520b-4565-83b5-d3af75715a46", zipCode: "85053" },
  { id: "3238f4bd-24d0-462c-b5eb-7cc9cd7448f1", zipCode: "85054" },
  { id: "031e3f54-89de-4d35-85ec-b3c7280bd130", zipCode: "85085" },
  { id: "c03ce1a4-2133-423e-8ce1-ca75f94b319e", zipCode: "85086" },
  { id: "1dbd5c2c-77d4-411d-ac62-7f797cbe0297", zipCode: "85087" },
  { id: "5c84c0f4-7b37-43cf-8151-51f0c29133d1", zipCode: "85250" },
  { id: "4c0517be-6413-4149-9b1a-3911a41e01ac", zipCode: "85251" },
  { id: "321d775b-2009-4584-ae29-352c7af8f67f", zipCode: "85252" },
  { id: "d589a40a-f409-45d0-b88c-3d32bb114990", zipCode: "85253" },
  { id: "8c749e15-7383-4128-82d8-ff55a082852f", zipCode: "85254" },
  { id: "28033b8e-3857-4d4d-a94b-6cd4906a35b3", zipCode: "85255" },
  { id: "eb958047-e715-4743-8561-695fb5f6b6d2", zipCode: "85256" },
  { id: "f04f1668-2ade-4561-862b-81224fd9a286", zipCode: "85257" },
  { id: "7574a5aa-c434-475f-a4df-2a6ed6252e44", zipCode: "85258" },
  { id: "2e19a19d-7d96-4071-a7da-2eb5af148181", zipCode: "85259" },
  { id: "a9fbdeb1-332d-4371-8213-d98d0dc6b09d", zipCode: "85260" },
  { id: "4dbbefe3-e0c5-4160-8b20-04e7e3a657ae", zipCode: "85261" },
  { id: "c954b8ba-4d77-457a-b3a4-9f21a9b47e5a", zipCode: "85262" },
  { id: "db244b01-5faa-47a8-92a6-7567bf09bbf2", zipCode: "85266" },
  { id: "852a5e80-7858-4959-9ee8-3384ef282b44", zipCode: "85267" },
  { id: "4faf8af6-1f07-4d99-b093-21d0c09739c0", zipCode: "85268" },
  { id: "6c86e3f3-8ffa-4c20-82de-4465a59081bb", zipCode: "85271" },
  { id: "61685e44-630b-4a2c-8911-644ea882ec4a", zipCode: "85301" },
  { id: "7fb65fcf-eb87-4b31-92db-53aa94f3f250", zipCode: "85302" },
  { id: "16a3a0c1-731f-4d1f-b5d9-837a6e63bcb1", zipCode: "85303" },
  { id: "6de0a46b-ff40-47c4-a99f-3807168ca341", zipCode: "85304" },
  { id: "bc5ed742-443f-475d-b069-18624509cb44", zipCode: "85305" },
  { id: "57da7c72-0a2f-4c3c-a31b-dd790ba88760", zipCode: "85306" },
  { id: "40972d0d-3402-4b45-a766-a175857c8940", zipCode: "85307" },
  { id: "6586fe0a-d250-4211-98a9-7314f4d86a90", zipCode: "85308" },
  { id: "7e085053-f32a-48e7-8598-241763b465a4", zipCode: "85310" },
  { id: "7d23cbce-f939-4b8e-8221-8b89793b041f", zipCode: "85311" },
  { id: "23d17eff-eb04-4bbc-8576-013a829eb6ca", zipCode: "85312" },
  { id: "9ff5b9bd-2510-4b74-be2d-a9fe4e3ddacf", zipCode: "85313" },
  { id: "070fe786-67b7-40ac-ac73-b92bb61290bc", zipCode: "85318" },
  { id: "4873bb08-6be9-45dc-a579-03c9092a8a9d", zipCode: "85324" },
  { id: "93b89b65-e5fd-435d-8147-2734a067c699", zipCode: "85327" },
  { id: "46813852-aa05-4c0e-9689-db22e54a874b", zipCode: "85331" },
  { id: "0b9409f2-13bf-4f05-b23a-8d4922698fac", zipCode: "85345" },
  { id: "1c66d6ad-d1bd-40c4-be7d-13d02e86a212", zipCode: "85351" },
  { id: "282b1416-4fa7-41a9-8109-709c9d69fb88", zipCode: "85374" },
  { id: "9bfe1cf6-28f3-43c8-a658-8324cc9ec5fc", zipCode: "85377" },
  { id: "844032ab-0a1c-4385-bd94-e2623f31f0b4", zipCode: "85378" },
  { id: "529a9963-1b16-4beb-ac55-0491073c1c9b", zipCode: "85379" },
  { id: "d6487724-9794-41c1-9d9d-f679e0650168", zipCode: "85380" },
  { id: "eef57d3f-4852-4933-b7c7-15a63816a613", zipCode: "85381" },
  { id: "7de09453-9e15-4726-b93b-07ae3697b110", zipCode: "85382" },
  { id: "b7370f80-786c-4871-b39a-7c3e123aa470", zipCode: "85383" },
  { id: "db7ead0b-edbf-4af4-9036-b2339010e4b9", zipCode: "85385" },
  { id: "ab249814-8db1-46c1-b948-95f08ec667bc", zipCode: "85083" },
  { id: "390caf42-22cb-4129-b571-09a8e4963042", zipCode: "85209" },
  { id: "a6822733-072f-436c-b463-5f58999c3189", zipCode: "85388" }
];

export class AllowZipCodes1610611744092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const allowZipCode of allowZipCodes) {
      await queryRunner.query("INSERT INTO \"ZipCodes\"(\"id\", \"zipCode\") VALUES ($1, $2);", [allowZipCode.id, allowZipCode.zipCode]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const allowZipCode of allowZipCodes) {
      await queryRunner.query("DELETE FROM \"ZipCodes\" WHERE \"id\" = $1;", [allowZipCode.id]);
    }
  }
}
