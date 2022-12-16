import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptOrdersRequest {
  @ApiProperty()
  @IsUUID(undefined, { each: true })
  @IsString({ each: true })
  readonly orderIds: Array<string>;
}
