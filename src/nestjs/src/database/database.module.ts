import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CONFIG_SCHEMA_TYPE } from '../config/config.module';
import { CategorySequelize } from '@fc/micro-videos/category/infra';
import { CastMemberSequelize } from '@fc/micro-videos/cast-member/infra';

const models = [
  CategorySequelize.CategoryModel,
  CastMemberSequelize.CastMemberModel,
];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (config: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        if (config.get('DB_VENDOR') === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: config.get('DB_HOST'),
            models,
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        }

        if (config.get('DB_VENDOR') === 'mysql') {
          return {
            dialect: 'mysql',
            host: config.get('DB_HOST'),
            database: config.get('DB_DATABASE'),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            port: config.get('DB_PORT'),
            models,
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        }

        throw new Error('Unsupported database config');
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
