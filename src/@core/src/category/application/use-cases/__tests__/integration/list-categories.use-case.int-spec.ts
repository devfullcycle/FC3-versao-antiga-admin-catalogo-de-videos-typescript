import { ListCategoriesUseCase } from "../../list-categories.use-case";
import { Category } from "../../../../domain/entities/category";
import { setupSequelize } from "../../../../../@seedwork/infra";
import { CategorySequelize } from "../../../../infra/db/sequelize/category-sequelize";

describe("ListCategoriesUseCase Integration Tests", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelize.CategoryRepository(
      CategorySequelize.CategoryModel
    );
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const categories = Category.fake()
      .theCategories(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(categories);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...categories].reverse().map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    const categories = [
      new Category({ name: "a" }),
      new Category({
        name: "AAA",
      }),
      new Category({
        name: "AaA",
      }),
      new Category({
        name: "b",
      }),
      new Category({
        name: "c",
      }),
    ];
    await repository.bulkInsert(categories);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[1].toJSON(), categories[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[0].toJSON()],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[0].toJSON(), categories[2].toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
