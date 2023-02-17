import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './cast-member.presenter';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';
import { Types } from '@fc/micro-videos/cast-member/domain';

describe('CastMemberPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CastMemberPresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'test',
        type: Types.ACTOR,
        created_at,
      });

      expect(presenter.id).toBe('61cd7b66-c215-4b84-bead-9aef0911aba7');
      expect(presenter.name).toBe('test');
      expect(presenter.type).toBe(Types.ACTOR);
      expect(presenter.created_at).toBe(created_at);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    let presenter = new CastMemberPresenter({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'actor test',
      type: Types.ACTOR,
      created_at,
    });

    let data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'actor test',
      type: Types.ACTOR,
      created_at: created_at.toISOString().slice(0, 19) + '.000Z',
    });

    presenter = new CastMemberPresenter({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'director test',
      type: Types.DIRECTOR,
      created_at,
    });

    data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'director test',
      type: Types.DIRECTOR,
      created_at: created_at.toISOString().slice(0, 19) + '.000Z',
    });
  });
});

describe('CastMemberCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const actor = {
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'actor test',
        type: Types.ACTOR,
        created_at,
      };
      let presenter = new CastMemberCollectionPresenter({
        items: [actor],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([new CastMemberPresenter(actor)]);

      const director = {
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'director test',
        type: Types.DIRECTOR,
        created_at,
      };
      presenter = new CastMemberCollectionPresenter({
        items: [director],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([new CastMemberPresenter(director)]);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    let presenter = new CastMemberCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'actor test',
          type: Types.ACTOR,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'actor test',
          type: Types.ACTOR,
          created_at: created_at.toISOString().slice(0, 19) + '.000Z',
        },
      ],
    });

    presenter = new CastMemberCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'director test',
          type: Types.DIRECTOR,
          created_at,
        },
      ],
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'director test',
          type: Types.DIRECTOR,
          created_at: created_at.toISOString().slice(0, 19) + '.000Z',
        },
      ],
    });
  });
});
