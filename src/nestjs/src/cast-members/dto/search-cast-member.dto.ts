import { ListCastMembersUseCase } from '@fc/micro-videos/cast-member/application';
import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { Types } from '@fc/micro-videos/cast-member/domain';
import { Transform } from 'class-transformer';

export class SearchCastMemberDto implements ListCastMembersUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  @Transform(({ value }) => {
    if (value) {
      return {
        ...(value.name && { name: value.name }),
        ...(value.type && {
          // NaN será considerado como undefined ou null lá no SearchParams, então verificamos se é um número para manter o valor inválido original
          type: !Number.isNaN(parseInt(value.type))
            ? parseInt(value.type)
            : value.type,
        }),
      };
    }

    return value;
  })
  filter?: {
    name?: string;
    type?: Types;
  };
}
