import { UpdateCastMemberUseCase } from "../../update-cast-member.use-case";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { CastMemberSequelize } from "../../../../infra/db/sequelize/cast-member-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/testing/helpers/db";
import { EntityValidationError } from "../../../../../@seedwork/domain";
import { CastMember, Types } from "../../../../domain";

const { CastMemberRepository, CastMemberModel } = CastMemberSequelize;

describe("UpdateCastMemberUseCase Integration Tests", () => {
  let useCase: UpdateCastMemberUseCase.UseCase;
  let repository: CastMemberSequelize.CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id", name: "fake", type: "fake" } as any)
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
  });

  it("should throw an generic error", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);
    const genericError = new Error("Generic Error");
    jest.spyOn(repository, "update").mockRejectedValue(genericError);
    await expect(
      useCase.execute({
        id: entity.id,
        name: "test actor",
        type: Types.ACTOR,
      })
    ).rejects.toThrow(genericError);
  });

  it("should throw an entity validation", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);
    try {
      await useCase.execute({ id: entity.id } as any);
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

  it("should update a cast member", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    let output = await useCase.execute({ id: entity.id, name: "test", type: Types.ACTOR });
    expect(output).toStrictEqual({
      id: entity.id,
      name: "test",
      type: Types.ACTOR,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        type: Types;
      };
      expected: {
        id: string;
        name: string;
        type: Types;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          name: "test",
          type: Types.DIRECTOR,
        },
        expected: {
          id: entity.id,
          name: "test",
          type: Types.DIRECTOR,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        name: i.input.name,
        type: i.input.type,
      });
      const entityUpdated = await repository.findById(i.input.id);
      expect(output).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        id: entity.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});
