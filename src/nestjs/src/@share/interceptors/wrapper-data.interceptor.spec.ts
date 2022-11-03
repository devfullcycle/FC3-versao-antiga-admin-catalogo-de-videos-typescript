import { of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor Unit Tests', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });
  it.skip('should wrapper with data key', (done) => {
    expect.assertions(1);
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });

    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual({ data: { name: 'test' } });
        },
      })
      .add(() => {
        done();
      });
  });

  it('should not wrapper when meta key is not present', (done) => {
    expect(interceptor).toBeDefined();
    const result = { data: [{ name: 'test' }], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$
      .subscribe({
        next: (value) => {
          expect(value).toStrictEqual(result);
        },
      })
      .add(() => {
        done();
      });
  });
});
