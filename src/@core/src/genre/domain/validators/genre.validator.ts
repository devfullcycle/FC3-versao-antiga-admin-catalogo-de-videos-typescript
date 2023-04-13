import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInstance,
} from "class-validator";
import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { GenreProperties } from "../entities/genre";
import { CategoryId } from "../../../category/domain";
import { IterableNotEmpty } from "../../../@seedwork/domain/validators/rules/iterable-not-empty.rule";
import { Distinct } from "../../../@seedwork/domain/validators/rules/distinct.rule";

export class GenreRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Distinct((a: CategoryId, b: CategoryId) => a.value === b.value)
  @IsInstance(CategoryId, { each: true })
  @IterableNotEmpty()
  categories_id: Map<string, CategoryId>;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor({ name, categories_id, is_active, created_at }: GenreProperties) {
    Object.assign(this, { name, categories_id, is_active, created_at });
  }
}

export class GenreValidator extends ClassValidatorFields<GenreRules> {
  validate(data: GenreProperties): boolean {
    return super.validate(new GenreRules(data ?? ({} as any)));
  }
}

export class GenreValidatorFactory {
  static create() {
    return new GenreValidator();
  }
}

export default GenreValidatorFactory;
