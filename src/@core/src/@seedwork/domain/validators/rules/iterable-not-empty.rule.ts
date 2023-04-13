import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";
import { checkIsIterable } from "../../utils/array";

export function IterableNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IterableNotEmpty",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            value && checkIsIterable(value) && Array.from(value).length > 0
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should not be empty`;
        },
      },
    });
  };
}
