import CastMemberRepository from "../../domain/repository/cast-member.repository";
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from "../dto/cast-member-output";
import { default as DefaultUseCase } from "../../../@seedwork/application/use-case";

export namespace GetCastMemberUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.castMemberRepo.findById(input.id);
      return CastMemberOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    id: string;
  };

  export type Output = CastMemberOutput;
}

export default GetCastMemberUseCase;
