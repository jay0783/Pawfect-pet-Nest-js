import {
  ValidationArguments,
  ValidationOptions,
  isPhoneNumber,
  isString,
  matches,
  registerDecorator,
} from 'class-validator';
import { EmergencyModel } from '@pawfect/models';

function validateEmergency(
  emergency: EmergencyModel,
  options: IsAppEmergencyOptions,
): string | undefined {
  if (!emergency || typeof emergency !== 'object') {
    return 'Invalid emergency object signature!';
  }

  if (options?.idIsRequired && (!emergency.id || isString(emergency.id))) {
    return 'Emergency id is required!';
  }

  // if (!emergency.name || !isString(emergency.name) || !matches(emergency.name, /^[A-Za-z]{2,27}$/)) {
  // if (
  //   !emergency.name ||
  //   !isString(emergency.name) ||
  //   !matches(emergency.name, /^[A-Za-z]{2,27}$/)
  // ) {
  //   return 'Emergency name is not string or It is not match to pattern!';
  // }

  if (
    !emergency.phoneNumber ||
    // !isPhoneNumber(emergency.phoneNumber, undefined) ||
    !matches(
      emergency.phoneNumber,
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/im,
    )
  ) {
    return 'Emergency phoneNumber is not string or It is not match to pattern!';
  }
}

export function IsAppEmergency(
  options: IsAppEmergencyOptions = { idIsRequired: false },
) {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      // message: `${propertyName} is invalid`,
      message: `Please check your Emergency phone number`,
    };
    registerDecorator({
      name: 'IsAppEmergency',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(emergency: EmergencyModel, args: ValidationArguments) {
          const validationError = validateEmergency(emergency, options);
          if (!validationError) {
            return true;
          }

          validationOptions.message = validationError;
          return false;
        },
      },
    });
  };
}

export function IsAppEmergencyMany(
  options: IsAppEmergencyOptions = { idIsRequired: false },
) {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      // message: `${propertyName} is invalid`,
      message: `Please check your Emergency phone number`,
    };
    registerDecorator({
      name: 'IsAppEmergencyMany',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(
          emergencies: Array<EmergencyModel>,
          args: ValidationArguments,
        ) {
          if (
            !(typeof emergencies === 'object' && Array.isArray(emergencies))
          ) {
            return false;
          }

          for (const emergency of emergencies) {
            const validationError = validateEmergency(emergency, options);
            if (validationError) {
              validationOptions.message = validationError;
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}

interface IsAppEmergencyOptions {
  idIsRequired: boolean;
}
