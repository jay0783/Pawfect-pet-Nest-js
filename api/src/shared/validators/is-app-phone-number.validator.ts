import {
  ValidationArguments,
  ValidationOptions,
  matches,
  registerDecorator,
} from 'class-validator';

export function IsAppPhoneNumber() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      // message: `${propertyName} is invalid`,
      message: `Your phone number is invalid`,
    };
    return registerDecorator({
      name: 'IsAppPhoneNumber',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            value &&
            typeof value === 'string' &&
            matches(
              value,
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/im,
            )
          ) {
            return true;
          }

          validationOptions.message = `${propertyName} is not string or is not match to pattern!`;
          return false;
        },
      },
    });
  };
}
