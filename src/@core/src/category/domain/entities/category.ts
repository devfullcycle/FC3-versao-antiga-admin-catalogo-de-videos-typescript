import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "../../../@seedwork/domain/entity/entity";
//import ValidatorRules from "../../../@seedwork/validators/validator-rules";
import CategoryValidatorFactory from "../validators/category.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import { CategoryFakeBuilder } from "./category-fake-builder";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryPropsJson = Required<{ id: string } & CategoryProperties>;

export class Category extends Entity<CategoryProperties, CategoryPropsJson> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id);
    Category.validate(props);
    this.description = this.props.description;
    this.props.is_active = this.props.is_active ?? true;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(name: string, description: string): void {
    Category.validate({
      name,
      description,
    });
    this.name = name;
    this.description = description;
  }

  // static validate(props: Omit<CategoryProperties, "created_at">) {
  //   ValidatorRules.values(props.name, "name").required().string().maxLength(255);
  //   ValidatorRules.values(props.description, "description").string();
  //   ValidatorRules.values(props.is_active, "is_active").boolean();
  // }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create();
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

  get description() {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
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
    return CategoryFakeBuilder;
  }

  toJSON(): CategoryPropsJson {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}

//mapeamento em arquivo

//null ou vazio
//tamanho de parametros
//especificas: email, cpf, cnpj, cartao de credito

//desde que não fique preso a lib
//interface
