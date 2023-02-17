import request from 'supertest';
import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers';
import { UpdateCastMemberFixture } from '../../src/cast-members/fixtures';
import { CastMembersController } from '../../src/cast-members/cast-members.controller';
import { instanceToPlain } from 'class-transformer';
import { startApp } from '../../src/@share/testing/helpers';

describe('CastMembersController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/cast-members/:id (PUT)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = CastMember.fake().anActor();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name, type: faker.type.value },
          expected: {
            message:
              'Entity Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name, type: faker.type.value },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid  is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .put(`/cast-members/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateCastMemberFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .put(`/cast-members/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const validationError =
        UpdateCastMemberFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let castMemberRepo: CastMemberRepository.Repository;

      beforeEach(() => {
        castMemberRepo = app.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const castMember = CastMember.fake().anActor().build();
        await castMemberRepo.insert(castMember);
        return request(app.app.getHttpServer())
          .put(`/cast-members/${castMember.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a cast member', () => {
      const app = startApp();
      const arrange = UpdateCastMemberFixture.arrangeForSave();
      let castMember: CastMemberRepository.Repository;

      beforeEach(async () => {
        castMember = app.app.get<CastMemberRepository.Repository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const castMemberCreated = CastMember.fake().anActor().build();
          await castMember.insert(castMemberCreated);

          const res = await request(app.app.getHttpServer())
            .put(`/cast-members/${castMemberCreated.id}`)
            .send(send_data)
            .expect(200);
          const keyInResponse = UpdateCastMemberFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const castMemberUpdated = await castMember.findById(id);
          const presenter = CastMembersController.castMemberToResponse(
            castMemberUpdated.toJSON(),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
