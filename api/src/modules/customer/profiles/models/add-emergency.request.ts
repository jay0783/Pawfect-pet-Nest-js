import { IsNotEmpty } from "class-validator";
import { IsAppName, IsAppPhoneNumber } from "@pawfect/validators";


export class AddEmergencyRequest {
  @IsNotEmpty()
  @IsAppName()
  name!: string;

  @IsNotEmpty()
  @IsAppPhoneNumber()
  phoneNumber!: string;
}
