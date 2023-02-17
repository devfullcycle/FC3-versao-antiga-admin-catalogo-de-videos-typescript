import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EntityValidationErrorFilter } from './@share/exception-filters/entity-validation-error.filter';
import { NotFoundErrorFilter } from './@share/exception-filters/not-found-error.filter';
import { SearchValidationErrorFilter } from './@share/exception-filters/search-validation-error.filter';
import { WrapperDataInterceptor } from './@share/interceptors/wrapper-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new SearchValidationErrorFilter(),
    new NotFoundErrorFilter(),
  );
}
