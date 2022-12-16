import { Inject, Injectable } from "@nestjs/common";
import { collectDefaultMetrics, Gauge, Registry } from "prom-client";


export const PromRegistryToken = Symbol.for("prom-registry");

@Injectable()
export class MetricService {
  private metricsIsRegistry: boolean = false;


  registerMetrics(registry: Registry): void {
    if (this.metricsIsRegistry) {
      return;
    }

    collectDefaultMetrics({
      register: registry,
      gcDurationBuckets: [0.1, 0.2, 0.3, 1],
      eventLoopMonitoringPrecision: 4
    });

    this.metricsIsRegistry = true;
  }

}
