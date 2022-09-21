import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenter/category.presenter';

//Unit tests

// Inject - casos - mongoose, typeorm
//unidade - request e response
@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase.UseCase)
  private createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(UpdateCategoryUseCase.UseCase)
  private updateUseCase: UpdateCategoryUseCase.UseCase;

  @Inject(DeleteCategoryUseCase.UseCase)
  private deleteUseCase: DeleteCategoryUseCase.UseCase;

  @Inject(GetCategoryUseCase.UseCase)
  private getUseCase: GetCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private listUseCase: ListCategoriesUseCase.UseCase;

  //Arquitetura Hexagonal - Ports

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return new CategoryPresenter(output);
  }

  @Get()
  async search(@Query() searchParams: SearchCategoryDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUseCase.execute({ id });
    return new CategoryPresenter(output);
  }

  @Put(':id') //PUT vs PATCH
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCategoryDto,
    });
    return new CategoryPresenter(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute({ id });
  }
}
