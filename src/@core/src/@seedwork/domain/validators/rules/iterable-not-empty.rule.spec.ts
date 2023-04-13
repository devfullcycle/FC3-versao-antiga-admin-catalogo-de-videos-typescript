import { validateSync } from "class-validator";
import { IterableNotEmpty } from "./iterable-not-empty.rule";

describe("IterableNotEmpty Rule Tests", () => {
  
  it('should be invalid when value is null, undefined or zero', () => {
    class StubDtoTest {
      @IterableNotEmpty()
      numbers: number[];
    }

    const stubDto = new StubDtoTest();
    let errors = validateSync(stubDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints.IterableNotEmpty).toBe("numbers should not be empty");

    stubDto.numbers = null;
    errors = validateSync(stubDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints.IterableNotEmpty).toBe("numbers should not be empty");

    stubDto.numbers = undefined;
    errors = validateSync(stubDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints.IterableNotEmpty).toBe("numbers should not be empty");

    //@ts-expect-error
    stubDto.numbers = 0;
    errors = validateSync(stubDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints.IterableNotEmpty).toBe("numbers should not be empty");
  });

  it('should be invalid when value is not iterable', () => {
    class StubDtoTest {
      @IterableNotEmpty()
      number: number;
    }

    const stubDto = new StubDtoTest();
    stubDto.number = 1;
    let errors = validateSync(stubDto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints.IterableNotEmpty).toBe("number should not be empty");
  });

  it('should be valid', () => {
    class StubDtoTest {
      @IterableNotEmpty()
      numbers: any;
    }

    const stubDto = new StubDtoTest();
    stubDto.numbers = [1, 2, 3];
    const errors = validateSync(stubDto);
    expect(errors.length).toBe(0);

    stubDto.numbers = new Set([1, 2, 3]);
    const errors2 = validateSync(stubDto);
    expect(errors2.length).toBe(0);

    stubDto.numbers = new Map([[1, 1], [2, 2], [3, 3]]);
    const errors3 = validateSync(stubDto);
    expect(errors3.length).toBe(0);
  })
});
