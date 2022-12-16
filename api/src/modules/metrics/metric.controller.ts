import { Controller, Get, Inject, NotFoundException, Res } from "@nestjs/common";
import { Response } from "express";
import { Registry } from "prom-client";
import { MetricService, PromRegistryToken } from "./metric.service";

@Controller("metrics")
export class MetricController {
  constructor(
    @Inject(PromRegistryToken) private readonly registry: Registry,
    private readonly metricService: MetricService,
  ) { }


  @Get()
  async getMetrics(@Res() res: Response): Promise<void> {
    throw new NotFoundException();
    // this.metricService.registerMetrics(this.registry);
    // const metrics = await this.registry.metrics();

    // res.set('Content-Type', this.registry.contentType);
    // res.end(metrics);
  }
}
