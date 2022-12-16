import { matches, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'IsAppAddress', async: false })
export class IsAppAddress implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    if (typeof value === "string" && matches(value, /^[A-Za-z0-9,. ]{3,256}$/g)) {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return '${propertyName} is not string or is not match to pattern';
  }
}
