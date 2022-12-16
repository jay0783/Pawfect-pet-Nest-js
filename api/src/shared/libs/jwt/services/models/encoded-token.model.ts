import { DateTime } from "luxon";


export interface EncodedTokenModel {
  token: string;
  expiredAt: DateTime;
}
