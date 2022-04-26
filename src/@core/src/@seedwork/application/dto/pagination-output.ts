import { SearchResult } from "../../domain/repository/repository-contracts";

export type PaginationOutputDto<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult
  ): PaginationOutputDto<Item> {
    return {
      items, 
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}
