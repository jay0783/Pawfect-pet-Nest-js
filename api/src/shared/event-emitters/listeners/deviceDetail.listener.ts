import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { CustomerEntity, EmployeeEntity, UserEntity } from '../../db/entities';
import {
  CustomerRepository,
  EmployeeRepository,
  UserRepository,
} from '@pawfect/db/repositories';
import { LoginRequest } from '../../../modules/auth/models';

@Injectable()
export class DeviceDetailListener {
  constructor(
    @InjectRepository(UserEntity)
    @InjectRepository(CustomerEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly customerRepository: CustomerRepository, //
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  @OnEvent('SetDeviceDetails', { async: true, promisify: true })
  async handleDeviceDetailEvent(loginRequest: LoginRequest): Promise<void> {
    console.log('======Hello Users!======');
    const foundUserEntity:
      | UserEntity
      | undefined = await this.userRepository.findOne({
      where: { email: loginRequest.email },
    });
    const customer = await this.customerRepository.findOne({
      where: { user: foundUserEntity?.id },
    });

    const employee = await this.employeeRepository.findOne({
      where: { user: foundUserEntity?.id },
    });
    if (customer) {
      const customerEntity: CustomerEntity = customer!;
      customerEntity.deviceToken = loginRequest.deviceToken;
      customerEntity.deviceType = loginRequest.deviceType;

      await this.customerRepository.save(customerEntity);
    } else if (employee) {
      const employeeEntity: EmployeeEntity = employee;
      employeeEntity.deviceToken = loginRequest.deviceToken;
      employeeEntity.deviceType = loginRequest.deviceType;
      await this.employeeRepository.save(employee);
    }
  }
}
