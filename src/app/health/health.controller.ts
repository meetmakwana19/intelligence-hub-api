import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, HealthIndicatorResult, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private mongooseHealthIndicator: MongooseHealthIndicator) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([(): Promise<HealthIndicatorResult> => this.mongooseHealthIndicator.pingCheck('mongodb')]);
  }
}
