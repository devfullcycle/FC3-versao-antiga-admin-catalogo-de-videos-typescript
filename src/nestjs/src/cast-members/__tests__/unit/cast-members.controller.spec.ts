import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCastMemberUseCase,
  UpdateCastMemberUseCase,
  GetCastMemberUseCase,
  ListCastMembersUseCase,
} from '@fc/micro-videos/cast-member/application';
import { Types } from '@fc/micro-videos/cast-member/domain';
import { CastMembersController } from '../../cast-members.controller';
import { CreateCastMemberDto } from '../../dto/create-cast-member.dto';
import { UpdateCastMemberDto } from '../../dto/update-cast-member.dto';
import {
  CastMemberPresenter,
  CastMemberCollectionPresenter,
} from '../../presenter/cast-member.presenter';

describe('CastMemberController Unit Tests', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    controller = new CastMembersController();
  });

  it('should creates a cast member', async () => {
    const output: CreateCastMemberUseCase.Output = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'actor test',
      type: Types.ACTOR,
      created_at: new Date(),
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error define part of methods
    controller['createUseCase'] = mockCreateUseCase;
    const input: CreateCastMemberDto = {
      name: 'actor test',
      type: Types.ACTOR,
    };
    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      CastMembersController.castMemberToResponse(output),
    );
  });

  it('should updates a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateCastMemberUseCase.Output = {
      id,
      name: 'actor test',
      type: Types.ACTOR,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: UpdateCastMemberDto = {
      name: 'actor test',
      type: Types.ACTOR,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      CastMembersController.castMemberToResponse(output),
    );
  });

  it('should deletes a cast member', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error define part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a cast member', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetCastMemberUseCase.Output = {
      id,
      name: 'actor test',
      type: Types.ACTOR,
      created_at: new Date(),
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(
      CastMembersController.castMemberToResponse(output),
    );
  });

  it('should list cast members', async () => {
    const output: ListCastMembersUseCase.Output = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'actor test',
          type: Types.ACTOR,
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
    //@ts-expect-error define part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: { name: 'actor test' },
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CastMemberCollectionPresenter(output));
  });
});
