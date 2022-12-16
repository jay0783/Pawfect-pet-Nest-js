import { PaginationResponse } from "@pawfect/models";
import { EmergencyViewModel } from "./emergency.vm";


export interface GetEmergenciesResponse extends PaginationResponse<EmergencyViewModel> { }
