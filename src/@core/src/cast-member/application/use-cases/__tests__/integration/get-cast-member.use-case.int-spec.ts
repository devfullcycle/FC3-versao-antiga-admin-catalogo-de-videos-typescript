import {GetCastMemberUseCase} from "../../get-cast-member.use-case";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { CastMemberSequelize } from "../../../../infra/db/sequelize/cast-member-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/testing/helpers/db";
import { CastMember } from "../../../../domain";

const { CastMemberRepository, CastMemberModel } = CastMemberSequelize;

describe("GetCastMemberUseCase Integration Tests", () => {
  let useCase: GetCastMemberUseCase.UseCase;
  let repository: CastMemberSequelize.CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    useCase = new GetCastMemberUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID fake id`)
    );
  });

  it("should returns a cast member", async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);

    const output = await useCase.execute({ id: castMember.id });
    expect(output).toStrictEqual({
      id: castMember.id,
      name: castMember.name,
      type: castMember.type.value,
      created_at: castMember.created_at,
    });
  });
});
