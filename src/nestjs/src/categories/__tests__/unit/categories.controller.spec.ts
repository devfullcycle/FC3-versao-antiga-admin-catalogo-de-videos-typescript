import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
} from '@fc/micro-videos/category/application';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import {
  CategoryPresenter,
  CategoryCollectionPresenter,
} from '../../presenter/category.presenter';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
    //expect(expectedOutput).toStrictEqual(output);
  });

  it('should updates a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should deletes a category', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetCategoryUseCase.Output = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should list categories', async () => {
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CategoryCollectionPresenter(output));
  });
});

//repository in memory
//casos de uso - mock
