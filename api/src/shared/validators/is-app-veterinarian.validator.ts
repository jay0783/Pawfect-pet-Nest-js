import {
  ValidationArguments,
  ValidationOptions,
  isPhoneNumber,
  isString,
  matches,
  registerDecorator,
} from 'class-validator';

import { VeterinarianModel } from '@pawfect/models';

function validateVeterinarian(
  veterinarian: VeterinarianModel,
  options?: IsAppVeterinarianOptions,
): string | undefined {
  if (!veterinarian || typeof veterinarian !== 'object') {
    return 'Veterinarian object is invalid!';
  }

  if (
    options?.idIsRequired &&
    (!veterinarian.id || !isString(veterinarian.id))
  ) {
    return 'Veterinarian id is required!';
  }

  if (
    !veterinarian.name ||
    !isString(veterinarian.name) ||
    !matches(veterinarian.name, /^[a-zA-Z.+'-]+(?:\s[a-zA-Z.+'-]+)*\s?$/)
  ) {
    return 'Veterinarian name is not string or It is not match to pattern!';
  }

  if (
    !veterinarian.phoneNumber ||
    !isPhoneNumber(veterinarian.phoneNumber, undefined) ||
    !matches(
      veterinarian.phoneNumber,
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/im,
    )
  ) {
    return 'Veterinarian phoneNumber is not string or It is not match to pattern!';
  }
}

export function IsAppVeterinarian(
  options: IsAppVeterinarianOptions = { idIsRequired: false },
) {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = {
      message: `${propertyName} is invalid`,
    };

    return registerDecorator({
      name: 'IsAppVeterinarian',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(veterinarian: VeterinarianModel, args: ValidationArguments) {
          const validationError = validateVeterinarian(veterinarian, options);
          if (!validationError) {
            return true;
          }

          console.error(validationError);
          validationOptions.message = validationError;
          return false;
        },
      },
    });
  };
}

export function IsAppVeterinarianMany(
  options: IsAppVeterinarianOptions = { idIsRequired: false },
) {
  return (object: Object, propertyName: string): void => {
    let errorMessage = `${propertyName} is invalid`;
    const validationOptions: ValidationOptions = {
      message: () => '',
    };
    return registerDecorator({
      name: 'IsAppVeterinarianMany',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(
          emergencies: Array<VeterinarianModel>,
          args: ValidationArguments,
        ) {
          if (
            !(
              typeof emergencies === 'object' &&
              Array.isArray(emergencies) &&
              emergencies.length
            )
          ) {
            errorMessage = `${propertyName} is empty!`;
            return false;
          }

          for (const emergency of emergencies) {
            const validationError = validateVeterinarian(emergency, options);
            if (validationError) {
              console.error(validationError);
              errorMessage = validationError;
              return false;
            }
          }

          return true;
        },
        defaultMessage: () => errorMessage,
      },
    });
  };
}

interface IsAppVeterinarianOptions {
  idIsRequired: boolean;
}
