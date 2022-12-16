import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";


export function IsAppNotEmptyArray() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} is not array or empty` };
    return registerDecorator({
      name: "IsAppNotEmptyArray",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'object' && Array.isArray(value) && value.length) {
            return true;
          }

          validationOptions.message = `${propertyName} is not array or empty!`;
          return false;
        }
      }
    });
  };
}
