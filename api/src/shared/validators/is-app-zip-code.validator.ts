import {
  ValidationArguments,
  ValidationOptions,
  matches,
  registerDecorator,
} from 'class-validator';

export function IsAppZipCode() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      message: `${propertyName} is invalid`,
    };
    return registerDecorator({
      name: 'IsAppZipCode',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value === 'string' && matches(value, /^[0-9]{5}$/g)) {
            return true;
          }

          validationOptions.message = `${propertyName} is not string or is not match to pattern!`;
          return false;
        },
      },
    });
  };
}
