import { HasMany } from "sequelize-typescript";
import { UniqueEntityId } from "../../../@seedwork/domain";
import { Category } from "../../../category/domain";

class Genre {
  id: number;
  name: string;
  @HasMany()
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
}

new Genre();

class Genre {
    id: number;
    name: string;
    categories_id: UniqueEntityId[];
    createdAt: Date;
    updatedAt: Date;
}

new Genre();


class Pedido{
    id: number;
    cliente: Cliente;
    itens: Item[];
    createdAt: Date;
    updatedAt: Date;
}

class Item{
    id: number;
    produto: Produto;
    quantidade: number;
    createdAt: Date;
    updatedAt: Date;
}

class Pedido{
    id: number;
    cliente_id: UniqueEntityId;
    itens_id: UniqueEntityId[];
    createdAt: Date;
    updatedAt: Date;
}