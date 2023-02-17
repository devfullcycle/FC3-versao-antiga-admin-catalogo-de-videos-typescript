import { CastMember } from "./cast-member";
import { Chance } from "chance";
import { UniqueEntityId } from "../../../@seedwork/domain";
import { CastMemberType } from "../value-objects/cast-member-type.vo";

type PropOrFactory<T> = T | ((index: number) => T);

export class CastMemberFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _unique_entity_id = undefined;
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  // default generated actors
  private _type: PropOrFactory<CastMemberType> = (_index) =>
    CastMemberType.createAnActor();
  // auto generated in entity
  private _created_at = undefined;

  private countObjs: number;

  static aDirector() {
    return new CastMemberFakeBuilder<CastMember>().withType(
      CastMemberType.createADirector()
    );
  }

  static anActor() {
    return new CastMemberFakeBuilder<CastMember>().withType(
      CastMemberType.createAnActor()
    );
  }

  static theActors(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs).withType(
      CastMemberType.createAnActor()
    );
  }

  static theDirectors(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs).withType(
      CastMemberType.createADirector()
    );
  }

  static theCastMembers(countObjs: number) {
    return new CastMemberFakeBuilder<CastMember[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withUniqueEntityId(valueOrFactory: PropOrFactory<UniqueEntityId>) {
    this._unique_entity_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._type = valueOrFactory;
    return this;
  }

  withInvalidNameEmpty(value: "" | null | undefined) {
    this._name = value;
    return this;
  }

  withInvalidNameNotAString(value?: any) {
    this._name = value ?? 5;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  withInvalidType() {
    this._type = "fake type" as any;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map(
      (_, index) =>
        new CastMember(
          {
            name: this.callFactory(this._name, index),
            type: this.callFactory(this._type, index),
            ...(this._created_at && {
              created_at: this.callFactory(this._created_at, index),
            }),
          },
          !this._unique_entity_id
            ? undefined
            : this.callFactory(this._unique_entity_id, index)
        )
    );
    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  get unique_entity_id(): UniqueEntityId {
    return this.getValue("unique_entity_id");
  }

  get name(): string {
    return this.getValue("name");
  }

  get type(): CastMemberType {
    return this.getValue("type");
  }

  get created_at(): Date {
    return this.getValue("created_at");
  }

  private getValue(prop) {
    const optional = ["unique_entity_id", "created_at"];
    const privateProp = `_${prop}`;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
