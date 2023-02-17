import { CastMemberRepository } from "../../domain/repository/cast-member.repository";
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "../dto/cast-member-output";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";
import { CastMemberType, Types } from "../../domain";
import { EntityValidationError } from "../../../@seedwork/domain";

export namespace UpdateCastMemberUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.castMemberRepo.findById(input.id);

      const [type, errorCastMemberType] = CastMemberType.create(
        input.type
      );

      try {
        entity.update(input.name, type);
        await this.castMemberRepo.update(entity);
        return CastMemberOutputMapper.toOutput(entity);
      } catch (e) {
        this.handleError(e, errorCastMemberType);
      }
    }

    private handleError(e: Error, errorCastMemberType: Error | undefined) {
      if (e instanceof EntityValidationError) {
        e.setFromError("type", errorCastMemberType);
      }

      throw e;
    }
  }

  export type Input = {
    id: string;
    name: string;
    type: Types;
  };

  export type Output = CastMemberOutput;
}

export default UpdateCastMemberUseCase;