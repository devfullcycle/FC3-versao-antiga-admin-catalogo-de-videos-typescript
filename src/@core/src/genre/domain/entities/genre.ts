import { UniqueEntityId } from "../../../@seedwork/domain";
import { Category } from "../../../category/domain";

class Genre {
  //Agregado - Raiz do agregado Aggregate root
  id: string;
  name: string;
  categories: Category[]; //sub-entidade
  createdAt: Date;

  constructor(props: GenreProps, id?: UniqueEntityId) {
    this.id = id ? id.toString() : new UniqueEntityId().toString();
    this.name = props.name;
    this.categories = props.categories;
    this.createdAt = props.createdAt;
  }

  addCategory(category: Category) {
    this.categories.push(category);
  }

  removeCategory(categoryId: UniqueEntityId) {}

  updateCategoryName(categoryId: UniqueEntityId, name: string) {
    const category = this.categories.find(
      (category) => category.id === categoryId
    );
    if (!category) throw new Error("Category not found");

    category.update(name);
  }
}

//Eager loading

class Category {
  //Agregado

  public addXtp(){

  }
}

new Genre();

class Genre {
  id: number;
  name: string;
  categories_id: UniqueEntityId[];
  createdAt: Date;
  updatedAt: Date;


    constructor(props: GenreProps, id?: UniqueEntityId) {
        this.id = id ? id.toString() : new UniqueEntityId().toString();
        this.name = props.name;
        this.categories_id = props.categories_id;
        this.createdAt = props.createdAt;
    }

    addCategory(categoryId: UniqueEntityId) {

    }

    removeCategory(categoryId: UniqueEntityId) {

    }
}

new Genre();

// o que são agregados

// o volume de dados carregados
// o tamanho da consistência