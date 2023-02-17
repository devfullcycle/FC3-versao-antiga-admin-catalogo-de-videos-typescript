import InvalidDateError from "../errors/invalid-date.error";
import ValueObject from "./value-object";

export class CreatedAt extends ValueObject<Date> {
  constructor(readonly date?: Date) {
    const created_at = date || new Date();
    created_at.setMilliseconds(0);
    created_at.setMilliseconds(0);
    super(created_at);
    this.validate();
  }

  private validate() {
    const isValid = this.value instanceof Date && !isNaN(this.value.getTime());
    if (!isValid) {
      throw new InvalidDateError();
    }
  }
}

export default CreatedAt;
