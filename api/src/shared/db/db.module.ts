import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as Entities from "./entities";
import * as Repositories from "./repositories";
import { TransactionManager } from "./services";


@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ...Object.values(Entities),
      ...Object.values(Repositories)
    ])
  ],
  exports: [TypeOrmModule, TransactionManager],
  providers: [TransactionManager]
})
export class DbModule { }
