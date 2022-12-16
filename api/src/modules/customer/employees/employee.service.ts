import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import Decimal from "decimal.js";
import { QueryBuilder, SelectQueryBuilder } from "typeorm";

import { EmployeeRatingRepository, EmployeeRepository, OrderRepository } from "@pawfect/db/repositories";
import { CustomerEntity, EmployeeEntity, EmployeeRatingEntity, OrderEntity } from "@pawfect/db/entities";
import { GetEmployeeProfileResponse, makeEmployeeProfileResponse, RateEmployeeRequest } from "./models";
import { SuccessModel } from "@pawfect/models";


@Injectable()
export class EmployeeService {

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeeRatingRepository: EmployeeRatingRepository,
    private readonly orderRepository: OrderRepository
  ) { }


  async getEmployeeProfile(customerEntity: CustomerEntity, employeeId: string, orderId: string): Promise<GetEmployeeProfileResponse> {
    const employeeEntity: EmployeeEntity | undefined = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ["employeeRatings", "employeeRatings.customer", "employeeRatings.customer.avatar"]
    });
    if (!employeeEntity) {
      throw new NotFoundException("Employee was not found!");
    }

    const wasOrderRated: boolean = await this.employeeRepository.wasOrderRated(customerEntity.id, orderId);

    const employeeProfileResponse = await makeEmployeeProfileResponse(employeeEntity, wasOrderRated);
    return employeeProfileResponse;
  }


  async rateEmployee(customerEntity: CustomerEntity, employeeId: string, rateRequest: RateEmployeeRequest): Promise<SuccessModel> {
    const employeeEntity = await this.employeeRepository.findOne(employeeId);
    if (!employeeEntity) {
      throw new NotFoundException("Employee was not found!");
    }

    const orderEntity = await this.orderRepository.findByIdAndCustomerId(rateRequest.orderId, customerEntity.id);
    if (!orderEntity) {
      throw new NotFoundException("Order was not found or not completed!");
    }

    const existRating = await this.employeeRatingRepository.findOne({
      where: { employee: employeeEntity.id, order: orderEntity.id, customer: customerEntity.id }
    });

    if (existRating) {
      throw new BadRequestException("Order has been rated already!");
    }

    const employeeRatingEntity = new EmployeeRatingEntity();
    employeeRatingEntity.customer = Promise.resolve(customerEntity);
    employeeRatingEntity.employee = Promise.resolve(employeeEntity);
    employeeRatingEntity.order = Promise.resolve(orderEntity);
    employeeRatingEntity.rating = rateRequest.rating;
    employeeRatingEntity.comment = rateRequest.comment || null;

    await this.employeeRatingRepository.save(employeeRatingEntity);


    //#region recalculation employee rating

    const employeeRatings = await this.employeeRatingRepository.find({ where: { employee: employeeEntity.id } });

    if (employeeRatings.length === 0) {
      employeeEntity.rating = 0;
      await this.employeeRepository.save(employeeEntity);
      return new SuccessModel();
    }

    const sumRating = employeeRatings.reduce(
      (accum, item) => accum.plus(item.rating),
      new Decimal(0)
    );

    employeeEntity.rating = +sumRating.div(employeeRatings.length).toFixed(2);
    await this.employeeRepository.save(employeeEntity);

    //#endregion


    return new SuccessModel();
  }
}
