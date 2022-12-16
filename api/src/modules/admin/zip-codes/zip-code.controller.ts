import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ZipCodeService } from './zip-code.service';
import {
  AddZipCodeResponse,
  AddZipCodeRequest,
  GetZipCodesResponse,
} from './models';
import { SuccessModel } from '@pawfect/models';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Zip-code')
@Controller('admin/zip-codes')
@UseGuards(AuthGuard('admin-jwt'))
export class ZipCodeController {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Put()
  async addZipCode(
    @Body() addZipCodeRequest: AddZipCodeRequest,
  ): Promise<AddZipCodeResponse> {
    const createdZipCode = await this.zipCodeService.addZipCode(
      addZipCodeRequest,
    );
    return createdZipCode;
  }

  @Get()
  async getAllZipCodes(): Promise<GetZipCodesResponse> {
    const zipCodes = await this.zipCodeService.getAllZipCodes();
    return zipCodes;
  }

  @Delete(':zipCodeId')
  async deleteZipCode(
    @Param('zipCodeId', new ParseUUIDPipe()) zipCodeId: string,
  ): Promise<SuccessModel> {
    const response = await this.zipCodeService.deleteZipCode(zipCodeId);
    return response;
  }
}
