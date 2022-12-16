import { Module, Scope } from "@nestjs/common";
import { Registry } from "prom-client";
import { MetricController } from "./metric.controller";
import { MetricService, PromRegistryToken } from "./metric.service";

@Module({
  controllers: [
    MetricController,
  ],
  providers: [
    {
      provide: PromRegistryToken,
      scope: Scope.TRANSIENT,
      useClass: Registry,
    },
    MetricService,
  ]
})
export class MetricModule { }
