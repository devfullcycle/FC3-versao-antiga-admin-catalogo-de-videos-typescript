export type FieldsErrors = {
  [field: string]: string[];
};

export default interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors;
  validatedData: PropsValidated;
  validate(data: any): boolean;
}