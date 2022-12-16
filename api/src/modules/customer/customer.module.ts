import { Module } from '@nestjs/common';

import { EmployeeModule } from './employees/employee.module';
import { HistoryModule } from './histories/history.module';
import { PetModule } from './pets/pet.module';
import { ProfileModule } from './profiles/profile.module';
import { PetServiceModule } from './pet-services/pet-service.module';
import { HolidayModule } from './holidays/holiday.module';
import { SettingsModule } from './settings/settings.module';
import { OrderModule } from './orders/order.module';
import { UpcomingModule } from './upcomings/upcoming.module';
import { MapModule } from './map/map.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    EmployeeModule,
    HistoryModule,
    HolidayModule,
    MapModule,
    PetModule,
    OrderModule,
    ProfileModule,
    PetServiceModule,
    UpcomingModule,
    SettingsModule,
    PaymentModule,
  ],
  exports: [],
})
export class CustomerModule {}
