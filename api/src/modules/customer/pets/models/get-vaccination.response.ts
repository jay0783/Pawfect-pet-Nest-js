import { PaginationResponse } from "@pawfect/models";
import { VaccinationViewModel } from "./vaccination.vm";

export interface GetVaccinationResponse extends PaginationResponse<VaccinationViewModel> { }
