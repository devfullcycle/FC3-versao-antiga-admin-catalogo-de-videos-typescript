# Montagem do ambiente de desenvolvimento (Docker e IDE)
# Criar uma aplicação TypeScript
# Criar entidade de Categoria
# Criar testes
# Criar Casos de Uso e Repositório
# Criar testes

# Repetir para as outras entidades Genre, Cast member Video
 
# Nest.js - Criação de API Rest
# Integração com RabbitMQ e Encoder de vídeo
# Testes E2E (End-to-End)

src/
   project1/
         package.json
   project2
         package.json

Neste desafio você deverá criar os CRUDs de categoria e cast member.

A categoria já tem todo o exemplo de tudo que foi passado no curso. Use-o como referência.

Já Cast Member são membros do elenco dos conteúdos da CodeFlix. Os membros serão ator ou diretor, eles terão um nome e a data em que foram criados.

Você deve criar uma entidade CastMember que tenha os seguintes campos:

name - deve ser string e um tamanho máximo de 255 caracteres.
type (aqui pode ser um Objeto de valor ou um Enum do TypeScript). Para diretor o valor do campo é 1, para ator é 2.
created_at
Aplique as validações conforme foi mostrado no curso.

Na listagem de cast members, devemos conseguir ordenar por nome ou created_at e buscar por name ou type.

Aplique toda a pirâmide de testes e mantém a cobertura em no mínimo em 80%.

Ao rodar os comandos: npm run test:cov e npm run tsc:check devemos testar tudo e não ter nenhum erro.

Bom trabalho!

enum CastMemberType {
    DIRECTOR = 1,
    ACTOR = 2
}

