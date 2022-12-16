import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";


export class SaveTrackedTimeRequest {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  orderCheckId!: string;

  @IsNumber()
  @Min(0)
  minutes!: number;
}
