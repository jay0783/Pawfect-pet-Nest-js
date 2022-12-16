import { IsNotEmpty } from "class-validator";
import { IsAppZipCode } from "@pawfect/validators";


export class CheckZipCodeRequest {
  @IsNotEmpty()
  @IsAppZipCode()
  zipCode!: string;
}
