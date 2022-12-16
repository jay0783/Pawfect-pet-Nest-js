import {
  ValidationArguments,
  ValidationOptions,
  matches,
  registerDecorator,
} from 'class-validator';

export function IsAppPassword() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      message: `${propertyName} is invalid`,
    };
    return registerDecorator({
      name: 'IsAppPassword',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            value &&
            typeof value === 'string' &&
            matches(value, /^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“ ”‘«»@~"']{5,27}$/g)
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
