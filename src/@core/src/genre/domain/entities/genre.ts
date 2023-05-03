import AggregateRoot from "../../../@seedwork/domain/entity/aggregate-root";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { CategoryId } from "../../../category/domain";
import GenreValidatorFactory from "../validators/genre.validator";
import { GenreFakeBuilder } from "./genre-fake-builder";

export type GenreProperties = {
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type GenreCreateCommand = Omit<GenreProperties, "categories_id"> & {
  categories_id: string[] | CategoryId[];
};

export class GenreId extends UniqueEntityId { }

export type GenrePropsJson = Required<
  { id: string } & Omit<GenreProperties, "categories_id">
> & { categories_id: string[] };

export class Genre extends AggregateRoot<
  GenreId,
  GenreProperties,
  GenrePropsJson
> {
  constructor(public readonly props: GenreProperties, id?: GenreId) {
    super(props, id ?? new GenreId());
    Genre.validate(props);
    this.props.is_active = this.props.is_active ?? true;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  static create(props: GenreCreateCommand, id?: GenreId) {
    const categories_id = new Map<string, CategoryId>();
    props.categories_id.forEach((categoryId) => {
      categories_id.set(
        categoryId instanceof CategoryId ? categoryId.value : categoryId,
        categoryId instanceof CategoryId
          ? categoryId
          : new CategoryId(categoryId)
      );
    });
    return new Genre({ ...props, categories_id }, id);
  }

  update(name: string): void {
    Genre.validate({
      ...this.props,
      name,
    });
    this.name = name;
  }

  addCategoryId(categoryId: CategoryId) {
    const categoriesId = new Map(this.categories_id).set(categoryId.value, categoryId);

    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  removeCategoryId(categoryId: CategoryId) {
    const categoriesId = new Map(this.categories_id);
    categoriesId.delete(categoryId.value);

    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  updateCategoriesId(newCategoriesId: CategoryId[]) {
    if (!Array.isArray(newCategoriesId) || !newCategoriesId.length) {
      return;
    }

    const categoriesId = new Map<string, CategoryId>();
    newCategoriesId.forEach((id) => categoriesId.set(id.value, id));

    Genre.validate({
      ...this.props,
      categories_id: categoriesId,
    });

    this.categories_id = categoriesId;
  }

  // reveria para rastrear adicionados e removidos
  // syncCategoriesId(newCategoriesIds: CategoryId[]) {
  //   if(!newCategoriesIds.length) {
  //     return;
  //   }
  //   this.categories_id.forEach((category_id) => {
  //     const notExists = !newCategoriesIds.find((newCategoryId) =>
  //       newCategoryId.equals(category_id)
  //     );
  //     if (notExists) {
  //       this.categories_id.delete(category_id.value);
  //     }
  //   });

  //   newCategoriesIds.forEach((categoryId) =>
  //     this.categories_id.set(categoryId.value, categoryId)
  //   );
  //   Genre.validate(this.props);
  // }

  static validate(props: GenreProperties) {
    const validator = GenreValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate() {
    this.props.is_active = true;
  }

  deactivate() {
    this.props.is_active = false;
  }

  get name() {
    return this.props.name;
  }

  private set name(value) {
    this.props.name = value;
  }

  get categories_id() {
    return this.props.categories_id;
  }

  private set categories_id(value: Map<string, CategoryId>) {
    this.props.categories_id = value;
  }

  get is_active() {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at() {
    return this.props.created_at;
  }

  static fake() {
    return GenreFakeBuilder;
  }

  toJSON(): GenrePropsJson {
    return {
      id: this.id,
      name: this.name,
      categories_id: Array.from(this.props.categories_id.values()).map(
        (categoryId) => categoryId.value
      ),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
