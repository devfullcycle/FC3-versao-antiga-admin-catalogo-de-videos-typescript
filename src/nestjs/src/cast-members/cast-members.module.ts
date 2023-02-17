import { CastMemberSequelize } from '@fc/micro-videos/cast-member/infra';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CastMembersController } from './cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from './cast-members.providers';

@Module({
  imports: [SequelizeModule.forFeature([CastMemberSequelize.CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBER_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBER_PROVIDERS.USE_CASES),
  ],
})
export class CastMembersModule {}
