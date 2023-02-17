import { DeleteCastMemberUseCase } from "../../delete-cast-member.use-case";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { CastMemberSequelize } from "../../../../infra/db/sequelize/cast-member-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/testing/helpers/db";
import { CastMember } from "../../../../domain";

const { CastMemberRepository, CastMemberModel } = CastMemberSequelize;

describe("DeleteCastMemberUseCase Integration Tests", () => {
  let useCase: DeleteCastMemberUseCase.UseCase;
  let repository: CastMemberSequelize.CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    useCase = new DeleteCastMemberUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID fake id`)
    );
  });

  it("should delete a cast member", async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    await useCase.execute({
      id: castMember.id,
    });
    await expect(repository.findById(castMember.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${castMember.id}`)
    );
  });
});
