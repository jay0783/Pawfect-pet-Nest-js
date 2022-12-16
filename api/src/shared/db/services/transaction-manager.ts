import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, EntityManager } from "typeorm";


@Injectable()
export class TransactionManager {
  constructor(
    @InjectConnection() private connection: Connection,
  ) { }


  async execWithTransaction<T>(execFn: (manager: EntityManager) => Promise<T | undefined>): Promise<T | undefined> {
    const queryRunner = this.connection.createQueryRunner();

    let result = undefined;
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      result = await execFn(queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err); // TODO 05.04.21: change on logger or app log event
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return result;
  }
}
