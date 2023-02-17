import { CastMemberSequelize } from "./cast-member-sequelize";
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain";
import { CastMember, CastMemberType, Types } from "#cast-member/domain";
import { setupSequelize } from "../../../../@seedwork/infra/testing/helpers/db";

const { CastMemberModel, CastMemberModelMapper } = CastMemberSequelize;

describe("CastMemberModelMapper Unit Tests", () => {
  setupSequelize({ models: [CastMemberModel] });

  it("should throws error when cast member is invalid", () => {
    const model = CastMemberModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    try {
      CastMemberModelMapper.toEntity(model);
      fail("The cast member is valid, but it needs throws a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
        type: ["Invalid cast member type: undefined"],
      });
    }
  });

  it("should throw a generic error", () => {
    const error = new Error("Generic Error");
    const spyValidate = jest
      .spyOn(CastMember, "validate")
      .mockImplementation(() => {
        throw error;
      });
    const model = CastMemberModel.build({
      id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    expect(() => CastMemberModelMapper.toEntity(model)).toThrow(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a cast member model to a cast member entity", () => {
    const created_at = new Date();
    const model = CastMemberModel.build({
      id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      type: Types.ACTOR,
      created_at,
    });
    const entity = CastMemberModelMapper.toEntity(model);
    expect(entity.toJSON()).toEqual(
      new CastMember(
        {
          name: "some value",
          type: CastMemberType.createAnActor(),
          created_at,
        },
        new UniqueEntityId("5490020a-e866-4229-9adc-aa44b83234c4")
      ).toJSON()
    );
  });
});
