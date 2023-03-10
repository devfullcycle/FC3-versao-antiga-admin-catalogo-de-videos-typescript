import { ValueObject } from "../value-objects";
import Entity from "./entity";

export abstract class AggregateRoot<
  EntityId extends ValueObject = any,
  Props = any,
  JsonProps = Required<{ id: string } & Props>
> extends Entity<EntityId, Props, JsonProps> {}

export default AggregateRoot;
