import {
  ValidationArguments, ValidationOptions, matches, registerDecorator
} from "class-validator";


export function IsAppMailbox() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} is invalid` };
    registerDecorator({
      name: "IsAppMailbox",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === "string" && matches(value, /^[A-Za-z0-9,.]{2,27}$/g)) {
            return true;
          }

          validationOptions.message = `${propertyName} is not string or is not match to pattern!`;
          return false;
        }
      }
    });
  };
}
