import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export abstract class Entity<
  Props = any,
  JsonProps = Required<{ id: string } & Props>
> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  // equals(obj: this): boolean {
  //   return this.id === obj.id;
  // }

  abstract toJSON(): JsonProps;
}

export default Entity;
//entity para object
