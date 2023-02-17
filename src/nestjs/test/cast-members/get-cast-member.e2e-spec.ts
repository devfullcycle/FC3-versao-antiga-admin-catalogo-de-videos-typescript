import request from 'supertest';
import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers';
import { CastMembersController } from '../../src/cast-members/cast-members.controller';
import { instanceToPlain } from 'class-transformer';
import { startApp } from '../../src/@share/testing/helpers';
import { CastMemberFixture } from '../../src/cast-members/fixtures';

describe('CastMembersController (e2e)', () => {
  const nestApp = startApp();
  describe('/cast-members/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Entity Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid  is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a cast member ', async () => {
      const castMemberRepo = nestApp.app.get<CastMemberRepository.Repository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const castMember = CastMember.fake().anActor().build();
      castMemberRepo.insert(castMember);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/cast-members/${castMember.id}`)
        .expect(200);
      const keyInResponse = CastMemberFixture.keysInResponse();
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = CastMembersController.castMemberToResponse(
        castMember.toJSON(),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
