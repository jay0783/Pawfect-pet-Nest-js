import { IPaginationOptions } from "nestjs-typeorm-paginate";


export interface GetConfirmedOrdersOptions extends IPaginationOptions {
  date: number;
}
