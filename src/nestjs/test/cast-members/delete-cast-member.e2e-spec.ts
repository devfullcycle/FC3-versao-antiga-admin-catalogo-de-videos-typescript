import request from 'supertest';
import {
  CastMember,
  CastMemberRepository,
} from '@fc/micro-videos/cast-member/domain';
import { CAST_MEMBER_PROVIDERS } from '../../src/cast-members/cast-members.providers';
import { startApp } from '../../src/@share/testing/helpers';
import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';

describe('CastMembersController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const nestApp = startApp();
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
          .delete(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a cast member response with status 204', async () => {
      const castMemberRepo = nestApp.app.get<CastMemberRepository.Repository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const castMember = CastMember.fake().anActor().build();
      await castMemberRepo.insert(castMember);

      await request(nestApp.app.getHttpServer())
        .delete(`/cast-members/${castMember.id}`)
        .expect(204);

      await expect(castMemberRepo.findById(castMember.id)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${castMember.id}`),
      );
    });
  });
});
