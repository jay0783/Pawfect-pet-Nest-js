import {
  ValidationArguments,
  ValidationOptions,
  isEnum,
  max,
  min,
  registerDecorator,
} from "class-validator";

import { VisitModel } from "@pawfect/models";
import { MainOrderVisitEnum } from "@pawfect/db/entities/enums";
import { MAX_TIME_MILLIS, MIN_TIME_MILLIS } from "@pawfect/constants";


function validateVisit(visit: VisitModel, options?: IsAppVisitOptions): string | undefined {
  if (!visit || typeof visit !== "object") {
    return "Visit is not object!";
  }

  if (!visit.type || !isEnum(visit.type, MainOrderVisitEnum)) {
    return "Visit type is incorrect!";
  }

  if (typeof visit.time !== "number" || !max(visit.time, MAX_TIME_MILLIS) || !min(visit.time, MIN_TIME_MILLIS)) {
    return "Visit time is more than max or less than min!";
  }
}


export function IsAppVisit(options: IsAppVisitOptions = {}) {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    return registerDecorator({
      name: "IsAppVisit",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(visit: VisitModel, args: ValidationArguments) {
          const validationError = validateVisit(visit, options);
          if (!validationError) {
            return true;
          }

          validationOptions.message = validationError; // TODO: custom error does not work
          return false;
        }
      }
    });
  };
}


export function IsAppVisitMany(options: IsAppVisitOptions = {}) {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    registerDecorator({
      name: "IsAppVisitMany",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(visits: Array<VisitModel>, args: ValidationArguments) {
          if (!(typeof visits === 'object' && Array.isArray(visits) && visits.length)) {
            args.constraints.push(`${propertyName} can't be empty!`);
            return false;
          }

          for (const visit of visits) {
            const validationError = validateVisit(visit, options);
            if (validationError) {
              args.constraints.push(validationError);
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}

interface IsAppVisitOptions {
}
