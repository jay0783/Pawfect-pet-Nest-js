import { GeoPositionModel } from "./geo-position.model";


export interface TimedGeoPositionModel extends GeoPositionModel {
  createdAt: number;
  name?: string;
}
