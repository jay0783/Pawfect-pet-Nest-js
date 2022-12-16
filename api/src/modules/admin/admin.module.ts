import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { EmployeeManagementModule } from './employees/employee.module';
import { FeeModule } from './fees/fee.module';
import { ServiceManagementModule } from './services-management/service-management.module';
import { HistoryModule } from './histories/history.module';
import { HolidayModule } from './holidays/holiday.module';
import { InProgressModule } from './in-progress/in-progress.module';
import { OrderModule } from './orders/order.module';
import { PetModule } from './pets/pet.module';
import { CustomerModule } from './customers/customer.module';
import { ZipCodeModule } from './zip-codes/zip-code.module';
import { TimeOffModule } from './time-offs/time-off.module';
import { NewOrderModule } from './new-orders/new-order.module';
import { CanceledOrderModule } from './canceled-orders/canceled-order.module';
import { ScheduleOrderModule } from './schedule-orders/schedule-order.module';
import { FirstOrderModule } from './first-order/first-order.module';
import { PaymentModule } from './payment/payment.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    AuthModule,
    EmployeeManagementModule,
    FeeModule,
    ServiceManagementModule,
    HistoryModule,
    HolidayModule,
    InProgressModule,
    NewOrderModule,
    OrderModule,
    PetModule,
    CustomerModule,
    ZipCodeModule,
    TimeOffModule,
    CanceledOrderModule,
    ScheduleOrderModule,
    FirstOrderModule,
    PaymentModule,
    SettingsModule,
  ],
})
export class AdminModule {}
