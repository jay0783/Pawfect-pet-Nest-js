import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  GetAllServicesResponse,
  GetServiceDetailsResponse,
  UpdateServiceChecklistRequest,
  GetPetExtraServiceResponse,
  UpdateServiceRequest,
  AddServiceRequest,
  ExtraServiceViewModel,
  makeSubcategoryViewModel,
  SubcategoryViewModel,
  AddExtraServiceRequest,
} from './models';
import { ServiceManagementService } from './service-management.service';
import { SuccessModel } from '@pawfect/models';
import { AddServiceChecklistRequest } from './models/add-service-checklist.request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServiceEntity, SubcategoryEntity } from '@pawfect/db/entities';

@ApiBearerAuth()
@ApiTags('Service-Management')
@UseGuards(AuthGuard('admin-jwt'))
@Controller('admin/services')
export class ServiceManagementController {
  constructor(
    private readonly serviceManagementService: ServiceManagementService,
  ) {}

  @Get('extras')
  async getPetExtraServices(): Promise<GetPetExtraServiceResponse> {
    const response: GetPetExtraServiceResponse = await this.serviceManagementService.getPetExtraServices();
    return response;
  }

  @Get('extras/meet')
  async getMeetAndGreet(): Promise<GetPetExtraServiceResponse> {
    const response: GetPetExtraServiceResponse = await this.serviceManagementService.meetAndGreetExtraServices();
    return response;
  }

  @Get('species')
  async getServicesForSpecies(
    @Query('type') type: string,
  ): Promise<ServiceEntity[]> {
    const services = await this.serviceManagementService.getServicesForSpecies(
      type,
    );
    //
    return services;
  }

  @Get('subcategories')
  async getSubcategories(
    @Query('categoryId', new ParseUUIDPipe()) categoryId: string,
  ): Promise<Array<SubcategoryViewModel>> {
    const subCategories: Array<SubcategoryEntity> = await this.serviceManagementService.getSubcategories(
      categoryId,
    );
    const subCategoriesViewModelPromises = subCategories.map((subCategory) => {
      return makeSubcategoryViewModel(subCategory);
    });
    const subCategoriesViewModel = await Promise.all(
      subCategoriesViewModelPromises,
    );
    return subCategoriesViewModel;
  }

  // @Get('extras/meet')
  // async meetAndGreetExtraService(): Promise<ExtraServiceViewModel> {
  //   const response: ExtraServiceViewModel = await this.serviceManagementService.meetAndGreetExtraServices();
  //   return response;
  // }

  @Get(':serviceId')
  async getServiceDetails(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
  ): Promise<GetServiceDetailsResponse> {
    const response = await this.serviceManagementService.getServiceDetails(
      serviceId,
    );
    return response;
  }

  @Get()
  async getAllServices(): Promise<GetAllServicesResponse> {
    const response = await this.serviceManagementService.getAllServices();
    return response;
  }

  @Patch(':serviceId')
  async updateService(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @Body() updateServiceRequest: UpdateServiceRequest,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.updateService(
      serviceId,
      updateServiceRequest,
    );
    return response;
  }

  @Put(':serviceId/checklist')
  async addCheckList(
    @Param('serviceId') serviceId: string,
    @Body() addChecklistRequest: AddServiceChecklistRequest,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.addServiceCheckList(
      serviceId,
      addChecklistRequest,
    );
    return response;
  }

  @Patch(':serviceId/checklist/:checkId')
  async updateCheckList(
    @Param('serviceId') serviceId: string,
    @Param('checkId') serviceCheckId: string,
    @Body() updateChecklistRequest: UpdateServiceChecklistRequest,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.updateServiceCheckList(
      serviceId,
      serviceCheckId,
      updateChecklistRequest,
    );
    return response;
  }

  @Delete(':serviceId/checklist/:checklistId')
  async deleteCheckList(
    @Param('serviceId') serviceId: string,
    @Param('checklistId') checklistId: string,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.deleteServiceCheckList(
      serviceId,
      checklistId,
    );
    return response;
  }

  @Patch('delete/:serviceId')
  async softDeleteService(
    @Param('serviceId') serviceId: string,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.softDeleteService(
      serviceId,
    );
    return response;
  }

  @Patch(':serviceId')
  async deleteService(
    @Param('serviceId') serviceId: string,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.deleteService(
      serviceId,
    );
    return response;
  }

  @Delete(':categoryId/category')
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<SuccessModel> {
    const response = await this.serviceManagementService.deleteCategory(
      categoryId,
    );
    return response;
  }

  @Delete('extra/:extraId')
  async deleteExtras(@Param('extraId') extraId: string): Promise<SuccessModel> {
    const response = await this.serviceManagementService.deleteExtras(extraId);
    return response;
  }

  @Post()
  async addService(
    @Body() addServiceRequest: AddServiceRequest,
  ): Promise<{ id: string }> {
    const service:
      | ServiceEntity
      | undefined = await this.serviceManagementService.addService(
      addServiceRequest,
    );
    //
    return { id: service!.id };
  }

  @Post('extra')
  async addExtraService(
    @Body() addExtraServiceRequest: AddExtraServiceRequest,
  ): Promise<SuccessModel> {
    const service = await this.serviceManagementService.addExtraService(
      addExtraServiceRequest,
    );
    //
    return new SuccessModel();
  }

  @Put('extra/:extraId')
  async editExtraService(
    @Param('extraId', new ParseUUIDPipe()) extraId: string,
    @Body() addExtraServiceRequest: AddExtraServiceRequest,
  ): Promise<SuccessModel> {
    const service = await this.serviceManagementService.editExtraService(
      addExtraServiceRequest,
      extraId,
    );
    //
    return new SuccessModel();
  }

  @Get('extra/:extraId')
  async getExtraService(
    @Param('extraId', new ParseUUIDPipe()) extraId: string,
  ): Promise<ExtraServiceViewModel> {
    const extraService: ExtraServiceViewModel = await this.serviceManagementService.getExtraService(
      extraId,
    );
    return extraService;
  }

  @Delete('extra/:extraId')
  async deleteExtraService(
    @Param('extraId', new ParseUUIDPipe()) extraId: string,
  ): Promise<SuccessModel> {
    const extraService = await this.serviceManagementService.deleteExtraService(
      extraId,
    );
    return new SuccessModel();
  }
}
