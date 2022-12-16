import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmployeeEntity } from '@pawfect/db/entities';
import { EmployeeRepository } from '@pawfect/db/repositories';

import { FileLib } from '@pawfect/libs/aws-s3';
import {
  PaginationRequest,
  PaginationResponse,
  SuccessModel,
} from '@pawfect/models';

import { EmployeeManagementService } from './employee.service';
import {
  AddEmergencyRequest,
  AddEmployeeRequest,
  AddEmployeeResponse,
  EditEmployeeRequest,
  EmployeePayrollViewModel,
  EmployeeTableItem,
  GetConfirmedOrdersResponse,
  GetDayScheduleRequest,
  GetDayScheduleResponse,
  GetEmployeeFullProfileResponse,
  GetEmployeeRatingsResponse,
  GetEmployeesForOrderResponse,
  GetEmployeeShortProfileResponse,
  GetMonthScheduleRequest,
  GetMonthScheduleResponse,
  GetTopRatedResponse,
  StatsResponse,
  GetMyPayrollsResponse,
  EmployeeDropdownList,
} from './models';
import { EmployeeOptionItemViewModel } from './models/employee-option-item.vm';

@ApiBearerAuth()
@ApiTags('Employee')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/employees')
export class EmployeeManagementController {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeeManagementService: EmployeeManagementService,
  ) {}

  @Put()
  async addEmployee(
    @Body() addEmployeeRequest: AddEmployeeRequest,
  ): Promise<AddEmployeeResponse> {
    const response: AddEmployeeResponse = await this.employeeManagementService.addEmployee(
      addEmployeeRequest,
    );
    return response;
  }

  @Patch(':id')
  async editEmployee(
    @Param('id', new ParseUUIDPipe()) employeeId: string,
    @Body() editEmployeeRequest: EditEmployeeRequest,
  ): Promise<SuccessModel> {
    const response = await this.employeeManagementService.editEmployee(
      employeeId,
      editEmployeeRequest,
    );
    return response;
  }

  @Post(':employeeId/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async setEmployeeAvatar(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @UploadedFile() avatar: FileLib,
  ): Promise<SuccessModel> {
    if (!avatar) {
      throw new BadRequestException('avatar is required');
    }

    const response = await this.employeeManagementService.setEmployeeAvatar(
      employeeId,
      avatar,
    );
    return response;
  }

  @Get()
  async getAll(
    @Query() paginationOpt: PaginationRequest,
    @Query() name: PaginationRequest,
  ): Promise<PaginationResponse<EmployeeTableItem>> {
    const employeesPaginationResponse = await this.employeeManagementService.getAll(
      paginationOpt,
      name,
    );
    return employeesPaginationResponse;
  }

  @Get('names')
  async getAllEmployeesNames(
    @Query() paginationOpt: PaginationRequest,
    @Query() name: PaginationRequest,
  ): Promise<PaginationResponse<EmployeeDropdownList>> {
    const employeesPaginationResponse = await this.employeeManagementService.getAllNames(
      paginationOpt,
      name,
    );
    return employeesPaginationResponse;
  }

  @Get(':employeeId/short')
  async getShortEmployeeProfile(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<GetEmployeeShortProfileResponse> {
    const employeeShortProfile: GetEmployeeShortProfileResponse = await this.employeeManagementService.getShortEmployeeProfile(
      employeeId,
    );
    return employeeShortProfile;
  }

  @Get(':employeeId/full')
  async getFullEmployeeProfile(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<GetEmployeeFullProfileResponse> {
    const employeeFullProfile: GetEmployeeFullProfileResponse = await this.employeeManagementService.getFullEmployeeProfile(
      employeeId,
    );
    return employeeFullProfile;
  }

  @Get('stats')
  async getStats(): Promise<StatsResponse> {
    const response = await this.employeeManagementService.getStats();
    return response;
  }

  @Get('option-list')
  async getAsOptionList(): Promise<Array<EmployeeOptionItemViewModel>> {
    const response = await this.employeeManagementService.getAsOptionList();
    return response;
  }

  @Put(':employeeId/emergency')
  async addEmergency(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Body() addEmergencyRequest: AddEmergencyRequest,
  ): Promise<SuccessModel> {
    const response = await this.employeeManagementService.addEmergency(
      employeeId,
      addEmergencyRequest,
    );
    return response;
  }

  @Get('top-rated')
  async getTopRated(): Promise<GetTopRatedResponse> {
    const response = await this.employeeManagementService.getTopRated();
    return response;
  }

  @Get(':employeeId/reviews')
  async getEmployeeReviews(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetEmployeeRatingsResponse> {
    const response = await this.employeeManagementService.getEmployeeReviews(
      employeeId,
      paginationRequest,
    );
    return response;
  }

  @Get(':employeeId/schedule/month')
  async getMonthSchedule(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Query() getMonthScheduleRequest: GetMonthScheduleRequest,
  ): Promise<GetMonthScheduleResponse> {
    const response = await this.employeeManagementService.getMonthSchedule(
      employeeId,
      getMonthScheduleRequest,
    );
    return response;
  }

  @Get(':employeeId/schedule/day')
  async getDaySchedule(
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Query() getDayScheduleRequest: GetDayScheduleRequest,
  ): Promise<GetDayScheduleResponse> {
    const response = await this.employeeManagementService.getDaySchedule(
      employeeId,
      getDayScheduleRequest,
    );
    return response;
  }

  @Get('order/:orderId')
  async getEmployeesForOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Query() paginationRequest: PaginationRequest,
  ): Promise<GetEmployeesForOrderResponse> {
    const response = await this.employeeManagementService.getEmployeesForOrder(
      orderId,
      paginationRequest,
    );
    return response;
  }

  @Get('payroll')
  async getAllPayroll(
    @Query() paginationOpt: PaginationRequest,
    @Query() name: PaginationRequest,
  ): Promise<PaginationResponse<EmployeePayrollViewModel>> {
    const employeesPaginationResponse = await this.employeeManagementService.getAllPayroll(
      paginationOpt,
      name,
    );
    return employeesPaginationResponse;
  }

  @Get('payroll/:employeeId')
  async getEmployeePayrolls(
    @Req() req: Request,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
    @Query()
    paginationRequest: PaginationRequest,
  ): Promise<GetMyPayrollsResponse> {
    const response = await this.employeeManagementService.getEmployeePayrolls(
      employeeId,
      paginationRequest,
    );
    return response;
  }

  @Get(':employeeId/schedule')
  async getSchedule(
    // @Req() req: Request,
    @Query() paginationRequest: PaginationRequest,
    @Param('employeeId', new ParseUUIDPipe()) employeeId: string,
  ): Promise<GetConfirmedOrdersResponse> {
    const employeeEntity = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employeeEntity) {
      throw new InternalServerErrorException(
        'Employee was not found on this user',
      );
    }

    const response = await this.employeeManagementService.getSchedule(
      employeeEntity,
      paginationRequest,
    );
    return response;
  }
}
