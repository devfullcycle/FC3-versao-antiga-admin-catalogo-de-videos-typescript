import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import GenreValidatorFactory from "../validators/genre.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import AggregateRoot from "../../../@seedwork/domain/entity/aggregate-root";
import { GenreFakeBuilder } from "./genre-fake-builder";
import { CategoryId } from "../../../category/domain";


export type GenreProperties = {
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
};

export type GenreCreateCommand = Omit<GenreProperties, 'categories_id'> & {
  categories_id: string[];
}

export class GenreId extends UniqueEntityId {}

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
      categories_id.set(categoryId, new CategoryId(categoryId));
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