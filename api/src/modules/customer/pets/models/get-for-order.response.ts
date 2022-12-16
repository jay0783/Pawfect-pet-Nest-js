import { PaginationResponse } from "@pawfect/models";


export interface GetForOrderResponse extends PaginationResponse<OrderPetItem> { }

export interface OrderPetItem {
  id: string;
  name: string;
  breed: string | null;
  imageUrl?: string;
}
