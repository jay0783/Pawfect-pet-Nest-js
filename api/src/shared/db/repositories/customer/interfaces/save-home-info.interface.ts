import { WeekDayEnum } from "../../../entities/enums";


export interface SaveHomeInfoInterface {
  lockboxDoorCode?: string;
  lockboxLocation?: string;
  homeAlarmSystem?: string;
  otherHomeAccessNotes?: string;
  otherRequestNotes?: string;
  mailbox?: string;
  isMailKeyProvided?: boolean;
  isTurnLight?: boolean;
  isSomeoneWillBeAtHome?: boolean;
  isWaterPlantsExists?: boolean;
  garbage: Array<WeekDayEnum>;
}
