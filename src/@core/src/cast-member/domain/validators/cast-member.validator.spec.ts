import { CastMemberType } from "../value-objects/cast-member-type.vo";
import CastMemberValidatorFactory, {
  CastMemberRules,
  CastMemberValidator,
} from "./cast-member.validator";
describe("CastMemberValidator Tests", () => {
  let validator: CastMemberValidator;

  beforeEach(() => (validator = CastMemberValidatorFactory.create()));

  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: null } }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  test("invalidation cases for type field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      type: [
        "type should not be empty",
        `type must be an instance of ${CastMemberType.name}`,
      ],
    });

    expect({ validator, data: { type: 5 } }).containsErrorMessages({
      type: [
        `type must be an instance of ${CastMemberType.name}`,
      ],
    });
  });

  describe("valid cases for fields", () => {
    type Arrange = {
      name: string;
      type: CastMemberType;
    };
    const arrange: Arrange[] = [
      {
        name: "some value",
        type: CastMemberType.createAnActor(),
      },
      {
        name: "some value",
        type: CastMemberType.createADirector(),
      },
    ];

    test.each(arrange)("validate %s", (item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CastMemberRules(item));
    });
  });
});
