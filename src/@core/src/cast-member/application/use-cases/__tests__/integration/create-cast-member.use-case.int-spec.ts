import { CreateCastMemberUseCase } from "../../create-cast-member.use-case";
import { CastMemberSequelize } from "../../../../infra/db/sequelize/cast-member-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/testing/helpers/db";
import { Types } from "../../../../domain";
import { EntityValidationError } from "../../../../../@seedwork/domain";

const { CastMemberRepository, CastMemberModel } = CastMemberSequelize;

describe("CreateCastMemberUseCase Integration Tests", () => {
  let useCase: CreateCastMemberUseCase.UseCase;
  let repository: CastMemberSequelize.CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase.UseCase(repository);
  });

  it("should throw an generic error", async () => {
    const genericError = new Error("Generic Error");
    jest.spyOn(repository, "insert").mockRejectedValue(genericError);
    await expect(
      useCase.execute({
        name: "test actor",
        type: Types.ACTOR,
      })
    ).rejects.toThrow(genericError);
  });

  it("should throw an entity validation", async () => {
    try {
      await useCase.execute({} as any);
      fail("Should throw an entity validation error");
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect(e.error).toEqual({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
        type: ["Invalid cast member type: undefined"],
      });
    }
  });

  it("should create a cast member", async () => {
    let output = await useCase.execute({
      name: "test actor",
      type: Types.ACTOR,
    });
    let entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: "test actor",
      type: Types.ACTOR,
      created_at: entity.props.created_at,
    });

    output = await useCase.execute({
      name: "test director",
      type: Types.DIRECTOR,
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: "test director",
      type: Types.DIRECTOR,
      created_at: entity.props.created_at,
    });
    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      name: "test director",
      type: Types.DIRECTOR,
      created_at: entity.props.created_at,
    })
  });
});
