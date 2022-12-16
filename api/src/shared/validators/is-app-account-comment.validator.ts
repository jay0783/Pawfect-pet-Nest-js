import {
  ValidationArguments,
  ValidationOptions,
  matches,
  registerDecorator,
} from 'class-validator';

export function IsAppAccountComment() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      message: `${propertyName} is invalid`,
    };
    registerDecorator({
      name: 'IsAppAccountComment',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            typeof value === 'string' &&
            matches(value, /^[A-Za-z,.!?#$%&*()-_+=/|\\“”‘«»@~"'` ]{0,200}$/g)
          ) {
            validationOptions.message = `${propertyName} is not string or is not match to pattern!`;
            return true;
          }

          return false;
        },
      },
    });
  };
}
