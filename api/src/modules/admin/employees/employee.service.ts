import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

import { EmployeeStatusEnum, UserRoleEnum } from '@pawfect/db/entities/enums';
import {
  EmployeeEntity,
  PhotoEntity,
  UserEntity,
  ZipCodeEntity,
} from '@pawfect/db/entities';
import {
  EmployeePayrollRepository,
  EmployeeRatingRepository,
  EmployeeRepository,
  EmployeeTimeOffRepository,
  OrderRepository,
  UserRepository,
  ZipCodeRepository,
} from '@pawfect/db/repositories';
import { AwsS3Lib, FileLib, FolderEnum } from '@pawfect/libs/aws-s3';
import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
} from '@pawfect/models';
import { DatesManager } from '@pawfect/services';
import {
  AddEmergencyRequest,
  AddEmployeeRequest,
  EditEmployeeRequest,
  EmployeeTableItem,
  GetEmployeeFullProfileResponse,
  GetEmployeeShortProfileResponse,
  makeGetEmployeeFullProfileResponse,
  makeGetEmployeeShortProfileResponse,
  StatsResponse,
  EmployeeOptionItemViewModel,
  makeEmployeeOptionItemViewModel,
  GetTopRatedResponse,
  makeTopEmployeeViewModel,
  GetEmployeeRatingsResponse,
  makeEmployeeReviewViewModel,
  GetMonthScheduleRequest,
  GetMonthScheduleResponse,
  GetDayScheduleRequest,
  GetDayScheduleResponse,
  makeScheduleItem,
  GetEmployeesForOrderResponse,
  makeEmployeeViewModel,
  EmployeePayrollViewModel,
  GetConfirmedOrdersResponse,
  makeConfirmedOrderViewModel,
  AddEmployeeResponse,
  GetMyPayrollsResponse,
  makePayrollViewModel,
  EmployeeDropdownList,
} from './models';

@Injectable()
export class EmployeeManagementService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly userRepository: UserRepository,
    private readonly zipCodeRepository: ZipCodeRepository,
    private readonly awsS3Service: AwsS3Lib,
    private readonly eventEmitter: EventEmitter2,
    private readonly employeeRatingRepository: EmployeeRatingRepository,
    private readonly employeeTimeOffRepository: EmployeeTimeOffRepository,
    private readonly orderRepository: OrderRepository,
    private readonly employeePayrollRepository: EmployeePayrollRepository,
  ) {}

  async addEmployee(
    addEmployeeRequest: AddEmployeeRequest,
  ): Promise<AddEmployeeResponse> {
    const existEmployeeEntity = await this.userRepository.findOne({
      where: { email: addEmployeeRequest.email, role: UserRoleEnum.EMPLOYEE },
    });
    if (existEmployeeEntity) {
      throw new BadRequestException('employee is exists with this email');
    }

    const zipCodeEntity:
      | ZipCodeEntity
      | undefined = await this.zipCodeRepository.findOne({
      where: { zipCode: addEmployeeRequest.zipCode },
    });
    if (!zipCodeEntity) {
      throw new NotFoundException('Zip code was not found!');
    }

    const passwordHash = await bcrypt.hash(
      addEmployeeRequest.password,
      await bcrypt.genSalt(),
    );

    const newUser: UserEntity = new UserEntity();
    newUser.email = addEmployeeRequest.email;
    newUser.passwordHash = passwordHash;
    newUser.role = UserRoleEnum.EMPLOYEE;
    var id;
    try {
      await this.userRepository.save(newUser);

      const newEmployeeEntity: EmployeeEntity = await this.employeeRepository.upsertEmployee(
        addEmployeeRequest,
        undefined,
        { userEntity: newUser, zipCodeEntity: zipCodeEntity },
      );
      await this.employeeRepository.addEmergencyBulk(
        newEmployeeEntity,
        addEmployeeRequest.emergencies,
      );
      id = newEmployeeEntity.id;
    } catch (err) {
      await this.userRepository.remove(newUser);
      throw err;
    }
    const addEmployeeResponse: AddEmployeeResponse = {
      id: id,
    };

    return addEmployeeResponse;
  }

  async editEmployee(
    employeeId: string,
    editEmployeeRequest: EditEmployeeRequest,
  ): Promise<SuccessModel> {
    const employeeEntity = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employeeEntity) {
      throw new BadRequestException("employee isn't exists with this email");
    }

    const userEntity: UserEntity = await employeeEntity.user;

    const passwordHash = await bcrypt.hash(
      editEmployeeRequest.password,
      await bcrypt.genSalt(),
    );
    userEntity.passwordHash = passwordHash;
    await this.userRepository.save(userEntity);

    await this.employeeRepository.upsertEmployee(
      editEmployeeRequest,
      employeeEntity,
    );
    await this.employeeRepository.clearEmergencies(employeeEntity);
    await this.employeeRepository.addEmergencyBulk(
      employeeEntity,
      editEmployeeRequest.emergencies,
    );

    return new SuccessModel();
  }

  async setEmployeeAvatar(
    employeeId: string,
    avatar: FileLib,
  ): Promise<SuccessModel> {
    const employeeEntity = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employeeEntity) {
      throw new BadRequestException("employee isn't exists with this email");
    }

    const avatarEntity: PhotoEntity = await this.awsS3Service.upload(
      avatar,
      FolderEnum.EMPLOYEE_PHOTO,
    );

    await this.employeeRepository.setAvatar(
      employeeEntity,
      avatarEntity,
      async (oldPhotoEntity: PhotoEntity | undefined) => {
        if (oldPhotoEntity) {
          this.eventEmitter
            .emitAsync('photo.delete', oldPhotoEntity)
            .catch((err) => console.error(err));
        }
      },
    );

    return new SuccessModel();
  }

  async getAll(
    paginationOpt: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<PaginationResponse<EmployeeTableItem>> {
    const now = DateTime.utc();

    const employees = await this.employeeRepository.getAllPayroll(
      paginationOpt,
      name,
    );

    const employeeTableResult: Array<EmployeeTableItem> = new Array<EmployeeTableItem>(
      employees.items.length,
    );
    for (let i = 0; i < employees.items.length; i++) {
      const employee = employees.items[i];
      const timeOffEntity = await this.employeeRepository.getTimeOffByDay(
        employee.id,
        now,
      );

      // console.log('*****************>>>', timeOffEntity);

      const avatarEntity = await employee.avatar;
      const employeeTableItem: EmployeeTableItem = {
        id: employee.id,
        name: employee.name,
        surname: employee.surname,
        imageUrl: avatarEntity?.url,
        rating: employee.rating,
        workTimeFrom: employee.workTimeFrom,
        workTimeTo: employee.workTimeTo,
        phoneNumber: employee.phoneNumber,
        status: employee.getStatusByTimeOff(timeOffEntity),
      };

      employeeTableResult[i] = employeeTableItem;
    }

    return { items: employeeTableResult, meta: employees.meta };
  }

  async getAllNames(
    paginationOpt: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<PaginationResponse<EmployeeDropdownList>> {
    const now = DateTime.utc();

    const employees = await this.employeeRepository.getAllPayroll(
      paginationOpt,
      name,
    );

    const employeeDropdownResult: Array<EmployeeDropdownList> = new Array<EmployeeDropdownList>(
      employees.items.length,
    );
    for (let i = 0; i < employees.items.length; i++) {
      const employee = employees.items[i];
      const employeeTableItem: EmployeeDropdownList = {
        id: employee.id,
        name: employee.name,
      };

      employeeDropdownResult[i] = employeeTableItem;
    }

    return { items: employeeDropdownResult, meta: employees.meta };
  }

  async getShortEmployeeProfile(
    employeeId: string,
  ): Promise<GetEmployeeShortProfileResponse> {
    const employee:
      | EmployeeEntity
      | undefined = await this.employeeRepository.findOne(employeeId, {
      relations: ['user', 'avatar'],
    });
    if (!employee) {
      throw new NotFoundException('Employee was not found', employeeId);
    }

    return makeGetEmployeeShortProfileResponse(employee);
  }

  async getFullEmployeeProfile(
    employeeId: string,
  ): Promise<GetEmployeeFullProfileResponse> {
    const employee:
      | EmployeeEntity
      | undefined = await this.employeeRepository.findOne(employeeId, {
      relations: ['user', 'avatar', 'emergencies', 'zipCode'],
    });
    if (!employee) {
      throw new BadRequestException('Employee was not found', employeeId);
    }

    return makeGetEmployeeFullProfileResponse(employee);
  }

  async getStats(): Promise<StatsResponse> {
    const date = DateTime.utc();
    // console.log('date=====', date);

    const employeeStats = await this.employeeRepository.getStatsByDate(date);

    return {
      available: employeeStats.available,
      vacation: employeeStats.vacation,
      sick: employeeStats.sick,
      unavailable: employeeStats.unavailable,
    };
  }

  async addEmergency(
    employeeId: string,
    addEmergencyRequest: AddEmergencyRequest,
  ): Promise<SuccessModel> {
    const employeeEntity = await this.employeeRepository.findOne(employeeId);
    if (!employeeEntity) {
      throw new NotFoundException('Employee was not found!');
    }

    await this.employeeRepository.addEmergency(
      employeeEntity,
      addEmergencyRequest,
    );
    return new SuccessModel();
  }

  async getAsOptionList(): Promise<Array<EmployeeOptionItemViewModel>> {
    const employees = await this.employeeRepository.find({
      relations: ['avatar'],
    });
    const employeeViewModelsPromises = employees.map(async (employee) =>
      makeEmployeeOptionItemViewModel(employee),
    );
    const employeeViewModels = await Promise.all(employeeViewModelsPromises);
    return employeeViewModels;
  }

  async getTopRated(): Promise<GetTopRatedResponse> {
    const employees = await this.employeeRepository.getTopRated();

    const topRatedViewModelPromises = employees.map(async (employee) =>
      makeTopEmployeeViewModel(employee),
    );
    const topRatedViewModel = await Promise.all(topRatedViewModelPromises);

    return { items: topRatedViewModel };
  }

  async getEmployeeReviews(
    employeeId: string,
    paginationOptions: PaginationRequest,
  ): Promise<GetEmployeeRatingsResponse> {
    const employeeRatings = await this.employeeRatingRepository.getEmployeeReviews(
      employeeId,
      paginationOptions,
    );

    const ratingViewModelsPromises = employeeRatings.items.map(async (rating) =>
      makeEmployeeReviewViewModel(rating),
    );
    const ratingViewModels = await Promise.all(ratingViewModelsPromises);
    return { items: ratingViewModels, meta: employeeRatings.meta };
  }

  async getMonthSchedule(
    employeeId: string,
    getMonthScheduleRequest: GetMonthScheduleRequest,
  ): Promise<GetMonthScheduleResponse> {
    const employeeEntity = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employeeEntity) {
      throw new NotFoundException('Employee was not found!');
    }

    const startDate = DateTime.fromMillis(
      getMonthScheduleRequest.dateFrom,
    ).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const endDate = DateTime.fromMillis(getMonthScheduleRequest.dateTo).set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });

    const response: GetMonthScheduleResponse = {};

    let iterator = startDate;
    while (iterator <= endDate) {
      response[iterator.toMillis()] = EmployeeStatusEnum.AVAILABLE;
      iterator = iterator.plus({ day: 1 });
    }

    const timeOffs = await this.employeeTimeOffRepository.findByRange(
      employeeId,
      startDate,
      endDate,
    );
    for (const timeOff of timeOffs) {
      for (const timeOffDate of timeOff.dates) {
        response[+timeOffDate] = employeeEntity.getStatusByTimeOff(timeOff);
      }
    }

    return response;
  }

  async getDaySchedule(
    employeeId: string,
    getDayScheduleRequest: GetDayScheduleRequest,
  ): Promise<GetDayScheduleResponse> {
    const employeeOrders = await this.orderRepository.findOrdersByDay(
      employeeId,
      getDayScheduleRequest.date,
    );

    const orderViewModelsPromises = employeeOrders.map(async (order) =>
      makeScheduleItem(order),
    );
    const orderViewModels = await Promise.all(orderViewModelsPromises);
    return { items: orderViewModels };
  }

  async getEmployeesForOrder(
    orderId: string,
    paginationRequest: PaginationRequest,
  ): Promise<GetEmployeesForOrderResponse> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!orderEntity) {
      throw new NotFoundException('Order was not found!');
    }

    const paginationEmployees = await this.employeeRepository.findAvailable(
      orderEntity.dateFrom,
      orderEntity.dateTo,
      paginationRequest,
    );

    const employeesViewModelsPromises = paginationEmployees.items.map(
      async (employee) => makeEmployeeViewModel(employee),
    );
    const employeesViewModels = await Promise.all(employeesViewModelsPromises);

    return { items: employeesViewModels, meta: paginationEmployees.meta };
  }

  async getAllPayroll(
    paginationOpt: IPaginationOptions,
    name: PaginationRequest,
  ): Promise<PaginationResponse<EmployeePayrollViewModel>> {
    const now = DateTime.utc();
    const employees = await this.employeeRepository.getAllForTable(
      paginationOpt,
      name,
    );

    const employeeTableResult: Array<EmployeePayrollViewModel> = new Array<EmployeePayrollViewModel>(
      employees.items.length,
    );

    for (let i = 0; i < employees.items.length; i++) {
      const employee = employees.items[i];
      let photo = await employee.avatar;

      const employeeTableItem: EmployeePayrollViewModel = {
        id: employee.id,
        name: employee.name,
        surname: employee.surname,
        time: employee.totalTime,
        amount: employee.orderAmount,
        rate: employee.jobRate,
        payroll: employee.payroll,
        imageUrl: photo?.url || null,
      };

      employeeTableResult[i] = employeeTableItem;
    }

    return { items: employeeTableResult, meta: employees.meta };
  }

  async getEmployeePayrolls(
    employeeId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<GetMyPayrollsResponse> {
    const payrolls = await this.employeePayrollRepository.getMyPayrolls(
      employeeId,
      paginationOptions,
    );

    const payrollViewModelsPromises = payrolls.items.map(async (payroll) =>
      makePayrollViewModel(payroll),
    );
    const payrollViewModels = await Promise.all(payrollViewModelsPromises);

    return { items: payrollViewModels, meta: payrolls.meta };
  }

  async getSchedule(
    employeeEntity: EmployeeEntity,
    paginationRequest: PaginationRequest,
  ): Promise<GetConfirmedOrdersResponse> {
    const paginateOrders = await this.orderRepository.getConfirmedOrdersAsAdminEmployee(
      employeeEntity.id,
      paginationRequest,
    );
    const confirmedOrdersPromises = paginateOrders.items.map(
      async (orderEntity) => makeConfirmedOrderViewModel(orderEntity),
    );
    const confirmedOrders = await Promise.all(confirmedOrdersPromises);
    return { items: confirmedOrders, meta: paginateOrders.meta };
  }
}
