import { Module } from "@nestjs/common";

import { InProgressController } from "./in-progress.controller";
import { InProgressService } from "./in-progress.service";


@Module({
  controllers: [InProgressController],
  providers: [InProgressService]
})
export class InProgressModule { }
