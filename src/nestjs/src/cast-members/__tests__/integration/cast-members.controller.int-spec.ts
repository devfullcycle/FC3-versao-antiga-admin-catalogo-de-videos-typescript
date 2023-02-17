import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCastMemberUseCase,
  UpdateCastMemberUseCase,
  ListCastMembersUseCase,
  GetCastMemberUseCase,
  DeleteCastMemberUseCase,
} from '@fc/micro-videos/cast-member/application';
import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CastMembersController } from '../../cast-members.controller';
import { CastMembersModule } from '../../cast-members.module';
import { CAST_MEMBER_PROVIDERS } from '../../cast-members.providers';
import {
  CastMemberFixture,
  ListCastMembersFixture,
  UpdateCastMemberFixture,
} from '../../fixtures';
import { CastMemberCollectionPresenter } from '../../presenter/cast-member.presenter';

describe('CastMembersController Integration Tests', () => {
  let controller: CastMembersController;
  let repository: CastMemberRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();

    controller = module.get(CastMembersController);
    repository = module.get(
      CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCastMemberUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCastMemberUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCastMembersUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(
      GetCastMemberUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCastMemberUseCase.UseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = CastMemberFixture.arrangeForSave();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(presenter.id);

        expect(entity.toJSON()).toStrictEqual({
          id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });

        expect(presenter).toEqual(
          CastMembersController.castMemberToResponse(entity.toJSON()),
        );
      },
    );
  });

  describe('should update a category', () => {
    const arrange = UpdateCastMemberFixture.arrangeForSave();

    const castMember = CastMember.fake().anActor().build();
    beforeEach(async () => {
      await repository.insert(castMember);
    });

    test.each(arrange)(
      'with request $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(castMember.id, send_data);
        const entity = await repository.findById(presenter.id);

        expect(entity.toJSON()).toStrictEqual({
          id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });
        expect(presenter).toEqual(
          CastMembersController.castMemberToResponse(entity.toJSON()),
        );
      },
    );
  });

  it('should delete a category', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const response = await controller.remove(castMember.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(castMember.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${castMember.id}`),
    );
  });

  it('should get a category', async () => {
    const castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    const presenter = await controller.findOne(castMember.id);
    expect(presenter).toStrictEqual(presenter);
  });

  describe('search method', () => {
    describe('should returns cast members using query empty ordered by created_at', () => {
      const { entitiesMap, arrange } =
        ListCastMembersFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter({
              items: entities.map((e) => e.toJSON()),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });

    describe('should returns output using pagination, sort and filter', () => {
      const { entitiesMap, arrange } = ListCastMembersFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is {"filter": $send_data.filter, "page": $send_data.page, "per_page": $send_data.per_page, "sort": $send_data.sort, "sort_dir": $send_data.sort_dir}',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new CastMemberCollectionPresenter({
              items: entities.map((e) => e.toJSON()),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
//cast-members?filter[type]=1
// Arquitetura em camadas

// Portas de entrada ----
// use cases
// coração do software
// infraestrutura

//Test Data Builders - Build Design Pattern
