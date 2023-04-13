import { validateSync } from "class-validator";
import {Distinct} from "./distinct.rule";

describe("Distinct Rule Tests", () => {
  it("should be valid when value is null, undefined or zero", () => {
    class StubDtoTest {
      @Distinct()
      numbers: number[];
    }

    const stubDto = new StubDtoTest();
    let errors = validateSync(stubDto);
    expect(errors.length).toBe(0);

    stubDto.numbers = null;
    errors = validateSync(stubDto);
    expect(errors.length).toBe(0);

    stubDto.numbers = undefined;
    errors = validateSync(stubDto);
    expect(errors.length).toBe(0);

    //@ts-expect-error
    stubDto.numbers = 0;
    errors = validateSync(stubDto);
    console.log(errors);
    expect(errors.length).toBe(0);
  });

  it("should be valid when value is not iterable", () => {
    class StubDtoTest {
      @Distinct()
      number: number;
    }

    const stubDto = new StubDtoTest();
    stubDto.number = 1;
    let errors = validateSync(stubDto);
    expect(errors.length).toBe(0);
  });

  describe("with primitive values", () => {
    class StubDtoTest {
      @Distinct()
      numbers: number[];
    }

    it("should be valid when value is not empty and has no duplicates", () => {
      const stubDto = new StubDtoTest();
      stubDto.numbers = [1, 2, 3];
      const errors = validateSync(stubDto);
      expect(errors.length).toBe(0);
    });

    it("should be invalid when value is not empty and has duplicates", () => {
      const stubDto = new StubDtoTest();
      stubDto.numbers = [1, 2, 3, 3];
      const errors = validateSync(stubDto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints.Distinct).toBe(
        "numbers must not contains duplicate values"
      );
    });
  });

  describe("with object values", () => {
    class StubDtoTest {
      @Distinct((a, b) => a.id === b.id)
      objects: { id: number }[];
    }

    it("should be valid when value is empty", () => {
      const stubDto = new StubDtoTest();
      const errors = validateSync(stubDto);
      expect(errors.length).toBe(0);
    });

    it("should be valid when value is not empty and has no duplicates", () => {
      const stubDto = new StubDtoTest();
      stubDto.objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const errors = validateSync(stubDto);
      expect(errors.length).toBe(0);
    });

    it("should be invalid when value is not empty and has duplicates", () => {
      const stubDto = new StubDtoTest();
      stubDto.objects = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 3 }];
      let errors = validateSync(stubDto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints.Distinct).toBe(
        "objects must not contains duplicate values"
      );

      //@ts-expect-error
      stubDto.objects = new Set([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 3 }]);
      errors = validateSync(stubDto);
      expect(errors.length).toBe(1);
      expect(errors[0].constraints.Distinct).toBe(
        "objects must not contains duplicate values"
      );
    });
  });
});
