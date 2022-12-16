import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SubscriberModule } from '@pawfect/db';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CronService } from './cron.service';
import { CustomerModule } from './customer/customer.module';
import { EmployeeModule } from './employee/employee.module';
import { MetricModule } from './metrics/metric.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    AdminModule,
    CustomerModule,
    EmployeeModule,
    SubscriberModule,
    MetricModule,
    SocketModule,
  ],
  controllers: [],
  providers: [CronService],
  exports: [],
})
export class IndexModule {}
