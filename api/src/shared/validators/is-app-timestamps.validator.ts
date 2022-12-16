import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator
} from "class-validator";


function validateTimestamp(time: any) {
  return new Date(time).getTime() > 0;
}

export function IsAppTimestamp() {
  return function (object: Object, propertyName: string) {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    registerDecorator({
      name: 'IsAppTimestamp',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(timestamp: any, args: ValidationArguments) {
          if (typeof timestamp === 'number' || typeof timestamp === 'string') {
            return validateTimestamp(timestamp);
          }

          return false;
        },
      },
    });
  };
}

export function IsAppTimestampMany() {
  return function (object: Object, propertyName: string) {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    registerDecorator({
      name: 'IsAppTimestampMany',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(timestamps: any, args: ValidationArguments) {
          if (typeof timestamps === 'object' && Array.isArray(timestamps) && timestamps.length) {
            return timestamps.every((time: any) => validateTimestamp(time));
          }

          return false;
        },
      },
    });
  };
}
