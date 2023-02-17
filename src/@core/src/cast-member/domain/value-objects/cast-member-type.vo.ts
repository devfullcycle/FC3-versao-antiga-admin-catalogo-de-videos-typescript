import { ValueObject } from "../../../@seedwork/domain";
import { Either } from "../../../@seedwork/domain/utils/either";
import { InvalidCastMemberTypeError } from "../errors/invalid-cast-member-type.error";

enum Types {
  DIRECTOR = 1,
  ACTOR = 2,
}

class CastMemberType extends ValueObject<Types> {
  private constructor(value: Types) {
    super(value);
    this.validate();
  }

  static create(
    value: Types
  ): Either<CastMemberType, InvalidCastMemberTypeError> {
    try {
      return Either.ok(new CastMemberType(value));
    } catch (error) {
      return Either.fail(error);
    }
  }

  private validate() {
    const isValid = this.value === Types.DIRECTOR || this.value === Types.ACTOR;
    if (!isValid) {
      throw new InvalidCastMemberTypeError(this.value);
    }
  }

  static createAnActor() {
    return CastMemberType.create(Types.ACTOR).getOk();
  }

  static createADirector() {
    return CastMemberType.create(Types.DIRECTOR).getOk();
  }
}

export { CastMemberType, Types };

// class CreateCastMemberUseCase{

//   execute(dados){
//     const errors = []
//     try{
//       type = CastMemberType.create(dados.type);
//     }catch(error){
//       errors.push()
//     }
//     try{
//       entity = new CastMember(dados);
//     }catch(error){
//       errors.push()
//     }
//   }
// }

// const errors = [];

// const eitherCorrentista = pegarCorrentista('1111-1')

// if(eitherCorrentista.isLeft()){
//   errors.push(eitherCorrentista.value);
// }

// const eitherSaque = saque(100);

// if(eitherSaque.isLeft()){
//   errors.push(eitherSaque.value);
// }

// class Either{ //Result

//   constructor(ok, fail){ //se left !== null, tenho erro, sucesso, erro
//     //se left !== null, tenho erro
//     //se right !== null, tenho valor, tenho sucesso
//     this.left = left;
//     this.right = right;
//   }

//   isLeft(){
//     return this.left !== null;
//   }

//   isRight(){
//     return this.right !== null;
//   }

// }

// const either = new Either(new Error, null);
// const either = new Either(null, valor);


// // golang

// user.profile?.address == 'sem perfil'

// const category = categoryRepo.findById()

// if(category){
//   category.name = 'Novo nome'
// }
