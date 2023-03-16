import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields";
import { GenreProperties } from "../entities/genre";


export class GenreRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  //

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
