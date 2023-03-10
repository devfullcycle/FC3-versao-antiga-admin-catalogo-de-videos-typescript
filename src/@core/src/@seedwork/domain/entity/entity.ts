import { ValueObject } from "../value-objects";

export abstract class Entity<
  EntityId extends ValueObject = any,
  Props = any,
  JsonProps = Required<{ id: string } & Props>
> {
  constructor(
    public readonly props: Props,
    public readonly entityId: EntityId
  ) {}

  get id(): string {
    return this.entityId.value;
  }

  // equals(obj: this): boolean {
  //   return this.id === obj.id;
  // }

  abstract toJSON(): JsonProps;
}

export default Entity;
//entity para object
