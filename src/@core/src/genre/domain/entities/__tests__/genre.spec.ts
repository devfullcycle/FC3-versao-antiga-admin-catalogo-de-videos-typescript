import { GenreId } from "./../genre";
import { CategoryId } from "./../../../../category/domain/entities/category";
import { Genre, GenreProperties } from "#genre/domain";

describe("Genre Unit Tests", () => {
  beforeEach(() => {
    Genre.validate = jest.fn();
  });
  test("constructor of genre", () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.value, categoryId],
    ]);
    let genre = new Genre({
      name: "test",
      categories_id: categoriesId,
    });
    expect(Genre.validate).toHaveBeenCalled();
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: categoriesId,
      is_active: true,
      created_at: genre.props.created_at,
    });
    expect(genre.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date(); //string
    genre = new Genre({
      name: "test",
      is_active: false,
      categories_id: categoriesId,
      created_at,
    });
    expect(Genre.validate).toHaveBeenCalledTimes(2);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: categoriesId,
      is_active: false,
      created_at,
    });

    genre = new Genre({
      name: "test",
      is_active: true,
      categories_id: categoriesId,
    });
    expect(Genre.validate).toHaveBeenCalledTimes(3);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: categoriesId,
      is_active: true,
      created_at: expect.any(Date),
    });
  });

  test("create method", () => {
    const categoryId = new CategoryId();
    console.log(categoryId);
    let genre = Genre.create({
      name: "test",
      categories_id: [categoryId],
    });
    expect(genre).toBeInstanceOf(Genre);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: new Map<string, CategoryId>([
        [categoryId.value, categoryId],
      ]),
      is_active: true,
      created_at: expect.any(Date),
    });

    const created_at = new Date();
    genre = Genre.create({
      name: "test",
      categories_id: [categoryId.value],
      is_active: false,
      created_at,
    });

    expect(genre).toBeInstanceOf(Genre);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: expect.any(Map),
      is_active: false,
      created_at,
    });
    expect(genre.categories_id.size).toBe(1);
    expect(Array.from(genre.categories_id.keys())).toStrictEqual([
      categoryId.value,
    ]);
    expect(genre.categories_id.get(categoryId.value)).toBeInstanceOf(
      CategoryId
    );

    genre = Genre.create({
      name: "test",
      categories_id: [categoryId.value],
      is_active: true,
      created_at,
    });

    expect(genre).toBeInstanceOf(Genre);
    expect(genre.props).toStrictEqual({
      name: "test",
      categories_id: expect.any(Map),
      is_active: true,
      created_at,
    });
    expect(genre.categories_id.size).toBe(1);
    expect(Array.from(genre.categories_id.keys())).toStrictEqual([
      categoryId.value,
    ]);
    expect(genre.categories_id.get(categoryId.value)).toBeInstanceOf(
      CategoryId
    );
  });

  describe("id field", () => {
    type GenreData = { props: GenreProperties; id?: GenreId };
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.value, categoryId],
    ]);
    const props = {
      name: "Action",
      categories_id: categoriesId,
    };
    const arrange: GenreData[] = [
      {
        props,
      },
      {
        props,
        id: null,
      },
      {
        props,
        id: undefined,
      },
      {
        props,
        id: new GenreId(),
      },
    ];

    test.each(arrange)("when props is %j", (item) => {
      const genre = new Genre(item.props, item.id as any);
      expect(genre.id).not.toBeNull();
      expect(genre.entityId).toBeInstanceOf(GenreId);
    });
  });

  test("getter and setter of name prop", () => {
    const genre = Genre.fake().aGenre().build();
    expect(genre.name).toBe(genre.props.name);

    genre["name"] = "other name";
    expect(genre.name).toBe("other name");
  });

  test("getter and setter of categories_id prop", () => {
    let genre = Genre.fake().aGenre().build();
    expect(genre.categories_id).toEqual(genre.props.categories_id);

    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.value, categoryId],
    ]);
    genre["categories_id"] = categoriesId;
    expect(genre.categories_id).toEqual(categoriesId);
  });

  test("getter of created_at prop", () => {
    let genre = Genre.fake().aGenre().build();
    expect(genre.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    genre = Genre.fake().aGenre().withCreatedAt(created_at).build();
    expect(genre.created_at).toBe(created_at);
  });

  it("should update a cast member", () => {
    const genre = Genre.fake().aGenre().build();
    genre.update("test1");

    expect(Genre.validate).toHaveBeenCalledTimes(2);
    expect(genre.name).toBe("test1");
  });
});
