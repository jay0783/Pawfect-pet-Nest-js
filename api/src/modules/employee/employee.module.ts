import { Module } from '@nestjs/common';

import { ConfirmedModule } from './confirmed/confirmed.module';
import { CustomerModule } from './customers/customer.module';
import { HistoryModule } from './histories/history.module';
import { MapModule } from './map/map.module';
import { NewOrderModule } from './new-orders/new-order.module';
import { PayrollModule } from './payrolls/payroll.module';
import { PetModule } from './pets/pet.module';
import { ProfileModule } from './profiles/profile.module';
import { RatingModule } from './ratings/rating.module';
import { TimeOffModule } from './time-offs/time-off.module';
import { FirstOrderModule } from './first-order/first-order.module';

@Module({
  imports: [
    ConfirmedModule,
    CustomerModule,
    HistoryModule,
    MapModule,
    NewOrderModule,
    PayrollModule,
    PetModule,
    ProfileModule,
    RatingModule,
    TimeOffModule,
    FirstOrderModule,
  ],
})
export class EmployeeModule {}
