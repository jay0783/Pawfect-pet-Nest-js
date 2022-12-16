import { ServiceViewModel } from "./service.vm";


export interface CategoryViewModel {
  id: string;
  imageUrl?: string;
  title: string;
  services: Array<ServiceViewModel>;
}
