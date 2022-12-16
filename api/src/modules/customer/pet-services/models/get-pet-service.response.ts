import { PaginationResponse } from "@pawfect/models";
import { CategoryViewModel } from "./category.vm";


export interface GetPetServiceResponse extends PaginationResponse<CategoryViewModel> { }
