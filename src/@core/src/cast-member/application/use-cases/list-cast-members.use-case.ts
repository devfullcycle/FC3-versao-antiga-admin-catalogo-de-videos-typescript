import { CastMemberRepository } from "../../domain/repository/cast-member.repository";
import { CastMemberOutput, CastMemberOutputMapper } from "../dto/cast-member-output";
import {default as DefaultUseCase} from "../../../@seedwork/application/use-case";
import { SearchInputDto } from "../../../@seedwork/application/dto/search-input";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from "../../../@seedwork/application/dto/pagination-output";
import { Types } from "../../domain";

export namespace ListCastMembersUseCase{
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private castMemberRepo: CastMemberRepository.Repository) {}
    
    async execute(input: Input): Promise<Output> {
      const params = CastMemberRepository.SearchParams.create(input);
      const searchResult = await this.castMemberRepo.search(params);
      return this.toOutput(searchResult);
    }
  
    private toOutput(searchResult: CastMemberRepository.SearchResult): Output {
      const items = searchResult.items.map((i) => {
        return CastMemberOutputMapper.toOutput(i);
      });
      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }

  export type Input = SearchInputDto<{name?: string, type?: Types}>;

  export type Output = PaginationOutputDto<CastMemberOutput>;
  
}

export default ListCastMembersUseCase;