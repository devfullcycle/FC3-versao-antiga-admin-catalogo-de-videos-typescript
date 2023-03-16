import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import GenreValidatorFactory from "../validators/genre.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import AggregateRoot from "../../../@seedwork/domain/entity/aggregate-root";
import { GenreFakeBuilder } from "./genre-fake-builder";

export type GenreProperties = {
  name: string;
  
  is_active?: boolean;
  created_at?: Date;
};



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
      
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}