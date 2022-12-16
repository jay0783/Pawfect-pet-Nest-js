import {
  ValidationArguments,
  ValidationOptions,
  matches,
  registerDecorator,
} from "class-validator";


export function IsAppServiceChecklist() {
  return (object: Object, propertyName: string): void => {
    const validationOptions: ValidationOptions = { message: `${propertyName} has duplicates numOrder` };
    return registerDecorator({
      name: "IsAppServiceChecklist",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(checklists: any, args: ValidationArguments) {
          if (typeof checklists === 'object' && Array.isArray(checklists)) {
            for (const [requestCheckIndex, requestCheck] of checklists.entries()) {
              const hasDuplicates = checklists.some((check, checkIndex) => {
                return check.numOrder === requestCheck.numOrder && checkIndex !== requestCheckIndex;
              });
              if(hasDuplicates) {
                return false;
              }
            }
          }

          return true;
        },
      },
    });
  };
}
