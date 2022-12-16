import {
  ValidationArguments, ValidationOptions, isNumber, registerDecorator
} from "class-validator";


function validateGeoPosition(value: any): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (isNumber(value.lat) && isNumber(value.long)) {
    value.lat = new Number(value.lat);
    value.long = new Number(value.long);

    return true;
  }

  return false;
}


export function IsAppGeoPosition() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    registerDecorator({
      name: "IsAppGeoPosition",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: Object, args: ValidationArguments) {
          if (validateGeoPosition(value)) {
            return true;
          }

          validationOptions.message = `${propertyName}.lat or ${propertyName}.long is invalid!`;
          return false;
        }
      }
    });
  };
}


export function IsAppGeoPositionMany() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    registerDecorator({
      name: "IsAppGeoPosition",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: Object, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          for (const geoposition of value) {
            if (!validateGeoPosition(geoposition)) {
              return false;
            }

          }

          return true;
        }
      }
    });
  };
}
