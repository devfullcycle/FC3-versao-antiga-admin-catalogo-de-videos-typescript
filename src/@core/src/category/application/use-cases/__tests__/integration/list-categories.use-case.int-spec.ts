import { ListCategoriesUseCase } from "../../list-categories.use-case";
import { CategorySequelize } from "../../../../infra/db/sequelize/category-sequelize";
import { setupSequelize } from "../../../../../@seedwork/infra/testing/helpers/db";
import { Category } from "../../../../domain";

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe("ListCategoriesUseCase Integration Tests", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it("should return output using empty input with categories ordered by created_at", async () => {
    const faker = Category.fake().theCategories(2);

    const entities = faker
      .withName((index) => `category ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build();

    await repository.bulkInsert(entities);

    const output = await useCase.execute({});

    expect(output).toMatchObject({
      items: [...entities].reverse().map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    const faker = Category.fake().aCategory();
    const entities = [
      faker.withName("a").build(),
      faker.withName("AAA").build(),
      faker.withName("AaA").build(),
      faker.withName("b").build(),
      faker.withName("c").build(),
    ];
    await repository.bulkInsert(entities);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toMatchObject({
      items: [entities[1], entities[2]].map((i) => i.toJSON()),
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
    expect(output).toMatchObject({
      items: [entities[0]].map((i) => i.toJSON()),
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
    expect(output).toMatchObject({
      items: [entities[0], entities[2]].map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
