import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
} from '@fc/micro-videos/category/application';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

//organizar a configuração e construção de serviços
@Injectable()
export class CategoriesService {
  @Inject(CreateCategoryUseCase.UseCase)
  private createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private listUseCase: ListCategoriesUseCase.UseCase;

  create(createCategoryDto: CreateCategoryUseCase.Input) {
    return this.createUseCase.execute(createCategoryDto);
  }

  search(input: ListCategoriesUseCase.Input) {
    return this.listUseCase.execute(input);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
