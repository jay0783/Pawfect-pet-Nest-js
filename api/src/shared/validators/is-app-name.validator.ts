import {
  ValidationArguments,
  ValidationOptions,
  matches,
  registerDecorator,
} from 'class-validator';

export function IsAppName() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      message: `${propertyName} is invalid`,
    };
    return registerDecorator({
      name: 'IsAppName',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          // /^[a-zA-Z\s]*$/
          if (
            typeof value === 'string' &&
            matches(value, /^[a-zA-Z\s.+'-]+(?:\s[a-zA-Z\s.+'-]+)*\s?$/g)
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
