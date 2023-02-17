import { CreateCastMemberUseCase } from "../../create-cast-member.use-case";
import { CastMemberInMemoryRepository } from "../../../../infra/db/in-memory/cast-member-in-memory.repository";
import { Either, EntityValidationError } from "../../../../../@seedwork/domain";
import {
  CastMember,
  CastMemberType,
  Types,
  InvalidCastMemberTypeError,
} from "../../../../domain";

describe("CreateCastMemberUseCase Unit Tests", () => {
  let useCase: CreateCastMemberUseCase.UseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase.UseCase(repository);
    jest.restoreAllMocks();
  });

  describe("handleError method", () => {
    it("should throw a generic error", () => {
      let error = new Error("error test");
      expect(() => useCase["handleError"](error, null)).toThrowError(error);

      expect(() =>
        useCase["handleError"](error, new Error("cast member type error"))
      ).toThrowError(error);
    });

    it("should throw an entity validation error", () => {
      let error = new EntityValidationError({ name: ["error test"] });
      expect(() => useCase["handleError"](error, null)).toThrowError(error);

      expect(() =>
        useCase["handleError"](error, new Error("cast member type error"))
      ).toThrowError(error);
      expect(error.error).toStrictEqual({
        name: ["error test"],
        type: ["cast member type error"],
      });
    });
  });

  describe("execute method", () => {
    it("should throw an generic error", async () => {
      const expectedError = new Error("generic error");
      jest.spyOn(repository, "insert").mockRejectedValue(expectedError);
      const spyHandleError = jest.spyOn(useCase, "handleError" as any);
      await expect(
        useCase.execute({
          name: "test",
          type: Types.ACTOR,
        })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenLastCalledWith(expectedError, null);
    });

    it("should throw an entity validation error", async () => {
      const expectedError = new EntityValidationError({
        name: ["is required"],
      });
      jest.spyOn(CastMember, "validate").mockImplementation(() => {
        throw expectedError;
      });
      const spyHandleError = jest.spyOn(useCase, "handleError" as any);
      await expect(
        useCase.execute({
          name: "test",
          type: Types.ACTOR,
        })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenLastCalledWith(expectedError, null);

      const castMemberTypeError = new InvalidCastMemberTypeError(
        "invalid type"
      );
      jest
        .spyOn(CastMemberType, "create")
        .mockImplementation(() => Either.fail(castMemberTypeError));
      await expect(
        useCase.execute({
          name: "test",
          type: Types.ACTOR,
        })
      ).rejects.toThrowError(expectedError);
      expect(spyHandleError).toHaveBeenLastCalledWith(
        expectedError,
        castMemberTypeError
      );
    });

    it("should create a cast member", async () => {
      const spyInsert = jest.spyOn(repository, "insert");
      let output = await useCase.execute({
        name: "test",
        type: Types.ACTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: repository.items[0].id,
        name: "test",
        type: Types.ACTOR,
        created_at: repository.items[0].created_at,
      });

      output = await useCase.execute({
        name: "test",
        type: Types.DIRECTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: repository.items[1].id,
        name: "test",
        type: Types.DIRECTOR,
        created_at: repository.items[1].created_at,
      });
    });
  });
});
