import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import CastMemberValidatorFactory from "../validators/cast-member.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import { CastMemberFakeBuilder } from "./cast-member-fake-builder";
import { CastMemberType, Types } from "../value-objects/cast-member-type.vo";
import AggregateRoot from "../../../@seedwork/domain/entity/aggregate-root";

export type CastMemberProperties = {
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberPropsJson = Required<
  { id: string } & Omit<CastMemberProperties, "type">
> & { type: Types };

export class CastMemberId extends UniqueEntityId{
  
}

export class CastMember extends AggregateRoot<
  CastMemberId,
  CastMemberProperties,
  CastMemberPropsJson
> {
  constructor(
    public readonly props: CastMemberProperties,
    entityId?: CastMemberId
  ) {
    super(props, entityId ?? new CastMemberId());
    CastMember.validate(props);
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(name: string, type: CastMemberType): void {
    CastMember.validate({
      name,
      type,
    });
    this.name = name;
    this.type = type;
  }

  static validate(props: CastMemberProperties) {
    const validator = CastMemberValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get name() {
    return this.props.name;
  }

  private set name(value) {
    this.props.name = value;
  }

  get type() {
    return this.props.type;
  }

  private set type(value: CastMemberType) {
    this.props.type = value;
  }

  get created_at() {
    return this.props.created_at;
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  toJSON(): CastMemberPropsJson {
    return {
      id: this.id,
      ...this.props,
      type: this.type.value,
    } as CastMemberPropsJson; // satisfies 4.9 TypeScript
  }
}
