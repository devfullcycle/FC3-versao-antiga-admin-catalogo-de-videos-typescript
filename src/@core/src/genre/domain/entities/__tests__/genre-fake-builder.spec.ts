import { CategoryId } from "../../../../category/domain";
import { GenreId } from "../genre";
import { GenreFakeBuilder } from "../genre-fake-builder";
import { Chance } from "chance";

describe("GenreFakerBuilder Unit Tests", () => {
  describe("entity_id prop", () => {
    const faker = GenreFakeBuilder.aGenre();

    it("should throw error when any with methods has called", () => {
      expect(() => faker["getValue"]("entity_id")).toThrow(
        new Error("Property entity_id not have a factory, use 'with' methods")
      );
    });

    it("should be undefined", () => {
      expect(faker["_entity_id"]).toBeUndefined();
    });

    test("withEntityId", () => {
      const genreId = new GenreId();
      const $this = faker.withEntityId(genreId);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_entity_id"]).toBe(genreId);

      faker.withEntityId(() => genreId);
      expect(faker["_entity_id"]()).toBe(genreId);

      expect(faker.entity_id).toBe(genreId);
    });

    it("should pass index to unique_entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new GenreId());
      faker.withEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new GenreId());
      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe("name prop", () => {
    const faker = GenreFakeBuilder.aGenre();
    it("should be a function", () => {
      expect(typeof faker["_name"] === "function").toBeTruthy();
    });

    it("should call the word method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withName", () => {
      const $this = faker.withName("test name");
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_name"]).toBe("test name");

      faker.withName(() => "test name");
      //@ts-expect-error name is callable
      expect(faker["_name"]()).toBe("test name");

      expect(faker.name).toBe("test name");
    });

    it("should pass index to name factory", () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidNameEmpty(undefined);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["_name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["_name"]).toBe("");
    });

    test("invalid too long case", () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_name"].length).toBe(256);

      const tooLong = "a".repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker["_name"].length).toBe(256);
      expect(faker["_name"]).toBe(tooLong);
    });
  });

  describe("categories_id prop", () => {
    const faker = GenreFakeBuilder.aGenre();
    it("should be an array", () => {
      expect(faker["_categories_id"]).toBeInstanceOf(Array);
    });

    it("should be empyt", () => {
      expect(faker["_categories_id"]).toHaveLength(0);
    });

    test("withCategoryId", () => {
      const categoryId1 = new CategoryId();
      const $this = faker.withCategoryId(categoryId1);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_categories_id"]).toStrictEqual([categoryId1]);

      const categoryId2 = new CategoryId();
      faker.withCategoryId(() => categoryId2);

      expect([
        faker["_categories_id"][0],
        //@ts-expect-error _categories_id is callable
        faker["_categories_id"][1](),
      ]).toStrictEqual([categoryId1, categoryId2]);
    });

    it("should pass index to categories_id factory", () => {
      const categoriesId = [new CategoryId(), new CategoryId()];
      faker.withCategoryId((index) => categoriesId[index]);
      const genre = faker.build();
      expect(genre.categories_id.get(categoriesId[0].value)).toBe(
        categoriesId[0]
      );

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withCategoryId((index) => categoriesId[index]);
      const genres = fakerMany.build();

      expect(genres[0].categories_id.get(categoriesId[0].value)).toBe(
        categoriesId[0]
      );
      console.log(genres[1].categories_id);
      expect(genres[1].categories_id.get(categoriesId[1].value)).toBe(
        categoriesId[1]
      );
    });
  });

  describe("is_active prop", () => {
    const faker = GenreFakeBuilder.aGenre();
    it("should be a function", () => {
      expect(typeof faker["_is_active"] === "function").toBeTruthy();
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_is_active"]).toBeTruthy();
      expect(faker.is_active).toBeTruthy();
    });

    test("deactivate", () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_is_active"]).toBeFalsy();
      expect(faker.is_active).toBeFalsy();
    });
  });

  describe("created_at prop", () => {
    const faker = GenreFakeBuilder.aGenre();

    it("should throw error when any with methods has called", () => {
      const fakerCategory = GenreFakeBuilder.aGenre();
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods")
      );
    });

    it("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(GenreFakeBuilder);
      expect(faker["_created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker["_created_at"]()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    it("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const genre = faker.build();
      expect(genre.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = GenreFakeBuilder.theGenres(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const genres = fakerMany.build();

      expect(genres[0].created_at.getTime()).toBe(date.getTime() + 0 + 2);
      expect(genres[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });

  it("should create a genre", () => {
    let faker = GenreFakeBuilder.aGenre();
    let genre = faker.build();

    expect(genre.entityId).toBeInstanceOf(GenreId);
    expect(typeof genre.name === "string").toBeTruthy();
    expect(genre.categories_id).toBeInstanceOf(Map);
    expect(genre.categories_id.size).toBe(1);
    expect(genre.categories_id.values().next().value).toBeInstanceOf(
      CategoryId
    );
    expect(genre.is_active).toBeTruthy();
    expect(genre.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const genreId = new GenreId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    faker = GenreFakeBuilder.aGenre();
    genre = faker
      .withEntityId(genreId)
      .withName("name test")
      .withCategoryId(categoryId1)
      .withCategoryId(categoryId2)
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    expect(genre.entityId.value).toBe(genreId.value);
    expect(genre.name).toBe("name test");
    expect(genre.categories_id.get(categoryId1.value)).toBe(categoryId1);
    expect(genre.categories_id.get(categoryId2.value)).toBe(categoryId2);
    expect(genre.is_active).toBeFalsy();
    expect(genre.props.created_at).toEqual(created_at);
  });

  it("should create many genres", () => {
    const faker = GenreFakeBuilder.theGenres(2);
    let genres = faker.build();

    genres.forEach((genre) => {
      expect(genre.entityId).toBeInstanceOf(GenreId);
      expect(genre.categories_id).toBeInstanceOf(Map);
      expect(genre.categories_id.size).toBe(1);
      expect(genre.categories_id.values().next().value).toBeInstanceOf(
        CategoryId
      );
      expect(genre.is_active).toBeTruthy();
      expect(genre.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const genreId = new GenreId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    genres = faker
      .withEntityId(genreId)
      .withName("name test")
      .withCategoryId(categoryId1)
      .withCategoryId(categoryId2)
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    genres.forEach((genre) => {
      expect(genre.entityId.value).toBe(genreId.value);
      expect(genre.name).toBe("name test");
      expect(genre.categories_id).toBeInstanceOf(Map);
      expect(genre.categories_id.get(categoryId1.value)).toBe(categoryId1);
      expect(genre.categories_id.get(categoryId2.value)).toBe(categoryId2);
      expect(genre.is_active).toBeFalsy();
      expect(genre.props.created_at).toEqual(created_at);
    });
  });
});
