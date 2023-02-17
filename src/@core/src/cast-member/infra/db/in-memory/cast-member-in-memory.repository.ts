import { SortDirection } from "#seedwork/domain/repository/repository-contracts";
import { InMemorySearchableRepository } from "../../../../@seedwork/domain/repository/in-memory.repository";
import { CastMember } from "../../../domain/entities/cast-member";
import CastMemberRepository from "../../../domain/repository/cast-member.repository";

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, CastMemberRepository.Filter>
  implements CastMemberRepository.Repository
{
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberRepository.Filter
  ): Promise<CastMember[]> { //Specification - Criteria Pattern
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      const containsName =
        filter.name &&
        i.props.name.toLowerCase().includes(filter.name.toLowerCase());
      const hasType = filter.type && i.props.type.equals(filter.type);
      return filter.name && filter.type
        ? containsName && hasType
        : filter.name
        ? containsName
        : hasType;
    });
  }

  protected async applySort(
    items: CastMember[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<CastMember[]> {
    return !sort
      ? super.applySort(items, "created_at", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}

export default CastMemberInMemoryRepository;