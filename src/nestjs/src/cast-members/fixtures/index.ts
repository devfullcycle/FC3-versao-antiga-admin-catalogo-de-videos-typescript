import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { CastMember, Types } from '@fc/micro-videos/cast-member/domain';

export class CastMemberFixture {
  static keysInResponse() {
    return ['id', 'name', 'type', 'created_at'];
  }

  static arrangeForSave() {
    return [
      {
        send_data: {
          name: 'actor test',
          type: Types.ACTOR,
        },
        expected: {
          name: 'actor test',
          type: Types.ACTOR,
        },
      },
      {
        send_data: {
          name: 'director test',
          type: Types.DIRECTOR,
        },
        expected: {
          name: 'director test',
          type: Types.DIRECTOR,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = () => CastMember.fake().anActor();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'type should not be empty',
            'type must be an integer number',
            'type must be one of the following values: 2, 1',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker().withInvalidNameEmpty(undefined).name,
          type: faker().type.value,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: faker().withInvalidNameEmpty(null).name,
          type: faker().type.value,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: faker().withInvalidNameEmpty('').name,
          type: faker().type.value,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      TYPE_UNDEFINED: {
        send_data: {
          name: faker().name,
          type: undefined,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
            'type must be one of the following values: 2, 1',
          ],
          ...defaultExpected,
        },
      },
      TYPE_NULL: {
        send_data: {
          name: faker().name,
          type: null,
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
            'type must be one of the following values: 2, 1',
          ],
          ...defaultExpected,
        },
      },
      TYPE_EMPTY: {
        send_data: {
          name: faker().name,
          type: '',
        },
        expected: {
          message: [
            'type should not be empty',
            'type must be an integer number',
            'type must be one of the following values: 2, 1',
          ],
          ...defaultExpected,
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: faker().name,
          type: faker().withInvalidType().type,
        },
        expected: {
          message: [
            'type must be an integer number',
            'type must be one of the following values: 2, 1',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = () => CastMember.fake().anActor();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'Invalid cast member type: undefined',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker().withInvalidNameEmpty(undefined).name,
          type: faker().type.value,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        send_data: {
          name: faker().withInvalidNameEmpty(null).name,
          type: faker().type.value,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: faker().withInvalidNameEmpty('').name,
          type: faker().type.value,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: faker().name,
          type: faker().withInvalidType().type,
        },
        expected: {
          message: ['Invalid cast member type: fake type'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class CreateCastMemberFixture {
  static keysInResponse() {
    return CastMemberFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CastMemberFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CastMemberFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    return CastMemberFixture.arrangeForEntityValidationError();
  }
}

export class UpdateCastMemberFixture {
  static keysInResponse() {
    return CastMemberFixture.keysInResponse();
  }

  static arrangeForSave() {
    return CastMemberFixture.arrangeForSave();
  }

  static arrangeInvalidRequest() {
    return CastMemberFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    return CastMemberFixture.arrangeForEntityValidationError();
  }
}

export class ListCastMembersFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = CastMember.fake()
      .theCastMembers(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const actor = CastMember.fake().anActor();
    const director = CastMember.fake().aDirector();
    const created_at = new Date();
    const entitiesMap = {
      actor_a: actor
        .withName('a')
        .withCreatedAt(new Date(created_at.getTime() + 1000))
        .build(),
      actor_AAA: actor
        .withName('AAA')
        .withCreatedAt(new Date(created_at.getTime() + 2000))
        .build(),
      actor_AaA: actor
        .withName('AaA')
        .withCreatedAt(new Date(created_at.getTime() + 3000))
        .build(),
      actor_b: actor
        .withName('b')
        .withCreatedAt(new Date(created_at.getTime() + 4000))
        .build(),
      actor_c: actor
        .withName('c')
        .withCreatedAt(new Date(created_at.getTime() + 5000))
        .build(),
      director_f: director
        .withName('f')
        .withCreatedAt(new Date(created_at.getTime() + 6000))
        .build(),
      director_e: director
        .withName('e')
        .withCreatedAt(new Date(created_at.getTime() + 7000))
        .build(),
    };

    const arrange_filter_by_name_sort_name_asc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { name: 'a' },
        },
        expected: {
          entities: [entitiesMap.actor_AAA, entitiesMap.actor_AaA],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: { name: 'a' },
        },
        expected: {
          entities: [entitiesMap.actor_a],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_actors_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { type: Types.ACTOR },
        },
        expected: {
          entities: [entitiesMap.actor_c, entitiesMap.actor_b],
          meta: {
            total: 5,
            current_page: 1,
            last_page: 3,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { type: Types.ACTOR },
        },
        expected: {
          entities: [entitiesMap.actor_AaA, entitiesMap.actor_AAA],
          meta: {
            total: 5,
            current_page: 2,
            last_page: 3,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_directors_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc' as SortDirection,
          filter: { type: Types.DIRECTOR },
        },
        expected: {
          entities: [entitiesMap.director_e, entitiesMap.director_f],
          meta: {
            total: 2,
            current_page: 1,
            last_page: 1,
            per_page: 2,
          },
        },
      },
    ];

    return {
      arrange: [
        ...arrange_filter_by_name_sort_name_asc,
        ...arrange_filter_actors_sort_by_created_desc,
        ...arrange_filter_directors_sort_by_created_desc,
      ],
      entitiesMap,
    };
  }
}
