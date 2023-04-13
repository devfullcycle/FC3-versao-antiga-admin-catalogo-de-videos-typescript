import { CategoryId } from "./../../../../category/domain/entities/category";
import { Genre } from "../genre";

describe("Genre Integration Tests", () => {
  describe("create method", () => {
    it("should a invalid genre using name property", () => {
      expect(() => new Genre({ name: null } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => new Genre({ name: "" } as any)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new Genre({ name: 5 } as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new Genre({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a invalid genre using categories_id property", () => {
      expect(
        () => new Genre({ categories_id: null } as any)
      ).containsErrorMessages({
        categories_id: [
          "categories_id should not be empty",
          "each value in categories_id must be an instance of CategoryId",
        ],
      });

      expect(
        () => new Genre({ categories_id: undefined } as any)
      ).containsErrorMessages({
        categories_id: [
          "categories_id should not be empty",
          "each value in categories_id must be an instance of CategoryId",
        ],
      });

      expect(
        () => new Genre({ categories_id: [] } as any)
      ).containsErrorMessages({
        categories_id: ["categories_id should not be empty"],
      });

      expect(
        () => new Genre({ categories_id: [1] } as any)
      ).containsErrorMessages({
        categories_id: [
          "each value in categories_id must be an instance of CategoryId",
        ],
      });

      const categoryId = new CategoryId();

      expect(
        () => new Genre({ categories_id: [categoryId, categoryId] } as any)
      ).containsErrorMessages({
        categories_id: ["categories_id must not contains duplicate values"],
      });

      expect(
        () =>
          new Genre({
            categories_id: new Map([
              [1, categoryId],
              [2, categoryId],
            ]),
          } as any)
      ).containsErrorMessages({
        categories_id: ["categories_id must not contains duplicate values"],
      });
    });

    it("should a valid genre", () => {
      expect.assertions(0);

      const categoryId1 = new CategoryId();
      new Genre({
        name: "test",
        categories_id: new Map([[categoryId1.value, categoryId1]]),
      });

      new Genre({
        name: "test",
        is_active: true,
        categories_id: new Map([[categoryId1.value, categoryId1]]),
      });

      const categoryId2 = new CategoryId();
      new Genre({
        name: "test",
        is_active: false,
        categories_id: new Map([
          [categoryId1.value, categoryId1],
          [categoryId2.value, categoryId2],
        ]),
      });
    });
  });

  describe("update method", () => {
    it("should a invalid genre using name property", () => {
      const genre = Genre.fake().aGenre().build();
      expect(() => genre.update(null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => genre.update("")).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => genre.update(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        genre.update("t".repeat(256))
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a valid genre", () => {
      expect.assertions(0);
      const genre = Genre.fake().aGenre().build();
      genre.update("name changed");
    });
  });

  describe("addCategoryId method", () => {
    it("should throw an error when category id is invalid", () => {
      const genre = Genre.fake().aGenre().build();
      expect(() => genre.addCategoryId("fake" as any)).containsErrorMessages({
        categories_id: [
          "each value in categories_id must be an instance of CategoryId",
        ],
      });
      expect(genre.categories_id.size).toBe(1);
    });

    it("should not add a duplicate category id", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.addCategoryId(categoryId);
      expect(genre.categories_id.size).toBe(1);
    });

    it("should add a category id", () => {
      const genre = Genre.fake().aGenre().build();
      const categoryId = new CategoryId();
      genre.addCategoryId(categoryId);
      expect(genre.categories_id.size).toBe(2);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });
  });

  describe("removeCategoryId method", () => {
    it("should throw an error when categories_id has just one id", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      expect(() => genre.removeCategoryId(categoryId)).containsErrorMessages({
        categories_id: ["categories_id should not be empty"],
      });
      expect(genre.categories_id.size).toBe(1);
    });

    it("should discard removal attempt when category id does not exist", () => {
      const genre = Genre.fake().aGenre().build();
      const otherCategoryId = new CategoryId();
      genre.removeCategoryId(otherCategoryId);
      expect(genre.categories_id.size).toBe(1);
    });
  });

  describe("updateCategoriesId method", () => {
    it("should discard update when argument is not an array", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId("fake id" as any);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    it("should discard update when argument is an empty array", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId([]);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    it("should throw an error when argument is an invalid category id", () => {
      const categoryId = new CategoryId();
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      expect(() =>
        genre.updateCategoriesId(["fake"] as any)
      ).containsErrorMessages({
        categories_id: [
          "each value in categories_id must be an instance of CategoryId",
        ],
      });
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });

    it("should update categories id", () => {
      const categoryId = new CategoryId();
      const categoriesId = [new CategoryId(), new CategoryId()];
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId(categoriesId);
      expect(genre.categories_id.size).toBe(2);
      expect(genre.categories_id.get(categoryId.value)).toBeUndefined();
      expect(genre.categories_id.get(categoriesId[0].value)).toEqual(
        categoriesId[0]
      );
      expect(genre.categories_id.get(categoriesId[1].value)).toEqual(
        categoriesId[1]
      );
    });

    it("should discard duplicated categories id on updating", () => {
      const categoryId = new CategoryId();
      const categoriesId = [categoryId, categoryId, categoryId];
      const genre = Genre.fake().aGenre().withCategoryId(categoryId).build();
      genre.updateCategoriesId(categoriesId);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.get(categoryId.value)).toEqual(categoryId);
    });
  });
});
