import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "../../../@seedwork/domain/repository/repository-contracts";
import { Category } from "../entities";

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<Category, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {}
}

export default CategoryRepository;

// export type CategoryFilter = string;

// export class SearchParams extends SearchParams<CategoryFilter> {}

// export class SearchResult extends SearchResult<
//   Category,
//   CategoryFilter
// > {}

// export default interface CategoryRepository
//   extends SearchableRepositoryInterface<
//     Category,
//     CategoryFilter,
//     CategorySearchParams,
//     CategorySearchResult
//   > {}

// Category -> filter, SearchParams, SearchResult, Repository
// Genre -> filter, SearchParams, SearchResult, Repository
