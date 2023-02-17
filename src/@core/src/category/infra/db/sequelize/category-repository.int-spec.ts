import { CategorySequelize } from "./category-sequelize";
import { Category, CategoryRepository } from "#category/domain";
import { UniqueEntityId, NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import _chance from "chance";

const chance = _chance();
const {
  CategoryModel,
  CategoryModelMapper,
  CategoryRepository: CategorySequelizeRepository,
} = CategorySequelize;
describe("CategorySequelizeRepository Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelize.CategoryRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should inserts a new entity", async () => {
    let category = new Category({ name: "Movie" });
    await repository.insert(category);
    let entity = await repository.findById(category.id);
    expect(entity.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false,
    });
    await repository.insert(category);
    entity = await repository.findById(category.id);
    expect(entity.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    await expect(
      repository.findById(
        new UniqueEntityId("9366b7dc-2d71-4799-b91c-c64adb205104")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity Not Found using ID 9366b7dc-2d71-4799-b91c-c64adb205104`
      )
    );
  });

  it("should finds a entity by id", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all categories", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it("should throw error on update when a entity not found", async () => {
    const entity = new Category({ name: "Movie" });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    );
  });

  it("should update a entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    entity.update("Movie updated", entity.description);
    await repository.update(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw error on delete when a entity not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    await expect(
      repository.delete(
        new UniqueEntityId("9366b7dc-2d71-4799-b91c-c64adb205104")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity Not Found using ID 9366b7dc-2d71-4799-b91c-c64adb205104`
      )
    );
  });

  it("should delete a entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    await repository.delete(entity.id);

    await expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    );
  });

  describe("search method tests", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "Movie",
          description: null,
          is_active: true,
          created_at: created_at,
        }));
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");

      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          is_active: true,
          created_at: created_at,
        })
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      const models = await CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie${index}`,
          description: null,
          is_active: true,
          created_at: new Date(created_at.getTime() + 100 + index),
        }));
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`${item.name}`).toBe(`${models[index + 1].name}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [categories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const categories = [
        Category.fake().aCategory().withName("b").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("d").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("c").build(),
      ];
      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CategoryRepository.SearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe("should search using filter, sort and paginate", () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("TeSt").build(),
      ];

      let arrange = [
        {
          search_params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategoryRepository.SearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          search_params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategoryRepository.SearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          let result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });
  });
});
