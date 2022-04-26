import ClassValidatorFields from "../class-validator-fields";
import * as libClassValidator from "class-validator";

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe("ClassValidatorFields Unit Tests", () => {
  it("should initialize erros and validatedData variables with null", () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([
      { property: "field", constraints: { isRequired: "some error" } },
    ]);
    const validator = new StubClassValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toBeNull();
    expect(validator.errors).toStrictEqual({field: ["some error"]});
  });

  it("should validate without errors", () => {
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([]);
    const validator = new StubClassValidatorFields();
    expect(validator.validate({field: 'value'})).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toStrictEqual({field: 'value'});
    expect(validator.errors).toBeNull();
  });
});
