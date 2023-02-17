import { CastMemberSequelize } from "./cast-member-sequelize";
import {
  CastMember,
  CastMemberRepository,
  CastMemberType,
  Types,
} from "#cast-member/domain";
import { UniqueEntityId, NotFoundError } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import _chance from "chance";
import orderBy from "lodash/orderBy";

const {
  CastMemberModel,
  CastMemberModelMapper,
  CastMemberRepository: CastMemberSequelizeRepository,
} = CastMemberSequelize;

describe("CastMemberSequelizeRepository Unit Tests", () => {
  setupSequelize({ models: [CastMemberModel] });
  let repository: CastMemberSequelize.CastMemberRepository;

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it("should inserts a new entity", async () => {
    let castMember = CastMember.fake().anActor().build();
    await repository.insert(castMember);
    let model = await repository.findById(castMember.id);
    expect(model.toJSON()).toStrictEqual(castMember.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    await expect(
      repository.findById(
        new UniqueEntityId("9366b7dc-2d71-4799-b91c-c64adb205104")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity Not Found using ID 9366b7dc-2d71-4799-b91c-c64adb205104`
      )
    );
  });

  it("should finds a entity by id", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should return all categories", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it("should throw error on update when a entity not found", async () => {
    const entity = CastMember.fake().anActor().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    );
  });

  it("should update a entity", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    entity.update("Movie updated", CastMemberType.createADirector());
    await repository.update(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw error on delete when a entity not found", async () => {
    await expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    await expect(
      repository.delete(
        new UniqueEntityId("9366b7dc-2d71-4799-b91c-c64adb205104")
      )
    ).rejects.toThrow(
      new NotFoundError(
        `Entity Not Found using ID 9366b7dc-2d71-4799-b91c-c64adb205104`
      )
    );
  });

  it("should delete a entity", async () => {
    const entity = CastMember.fake().anActor().build();
    await repository.insert(entity);

    await repository.delete(entity.id);
    const entityFound = await CastMemberModel.findByPk(entity.id);

    expect(entityFound).toBeNull();
  });

  describe("search method tests", () => {
    it("should order by created_at DESC when search params are null", async () => {
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withCreatedAt((index) => new Date(new Date().getTime() + 100 + index))
        .build();
      await repository.bulkInsert(castMembers);
      const spyToEntity = jest.spyOn(CastMemberModelMapper, "toEntity");

      const searchOutput = await repository.search(
        CastMemberRepository.SearchParams.create()
      );
      expect(searchOutput).toBeInstanceOf(CastMemberRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      [...castMembers.slice(1, 16)].reverse().forEach((item, index) => {
        expect(searchOutput.items[index]).toBeInstanceOf(CastMember);
        expect(item.toJSON()).toStrictEqual(searchOutput.items[index].toJSON());
      });
    });

    it("should apply paginate and filter by name", async () => {
      const castMembers = [
        CastMember.fake()
          .anActor()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .anActor()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .anActor()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .build(),
        CastMember.fake()
          .anActor()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];
      await repository.bulkInsert(castMembers);

      let searchOutput = await repository.search(
        CastMemberRepository.SearchParams.create({
          page: 1,
          per_page: 2,
          filter: { name: "TEST" },
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberRepository.SearchResult({
          items: [castMembers[0], castMembers[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: { name: "TEST" },
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        CastMemberRepository.SearchParams.create({
          page: 2,
          per_page: 2,
          filter: { name: "TEST" },
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberRepository.SearchResult({
          items: [castMembers[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: { name: "TEST" },
        }).toJSON(true)
      );
    });

    it("should apply paginate and filter by type", async () => {
      const created_at = new Date();
      const castMembers = [
        CastMember.fake()
          .anActor()
          .withName("actor1")
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .anActor()
          .withName("actor2")
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .anActor()
          .withName("actor3")
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .aDirector()
          .withName("director1")
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .aDirector()
          .withName("director2")
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .aDirector()
          .withName("director3")
          .withCreatedAt(created_at)
          .build(),
      ];
      await repository.bulkInsert(castMembers);

      const arrange = [
        {
          params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            filter: { type: Types.ACTOR },
          }),
          result: {
            items: [castMembers[0], castMembers[1]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
          },
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            filter: { type: Types.ACTOR },
          }),
          result: {
            items: [castMembers[2]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: null,
            sort_dir: null,
          },
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            filter: { type: Types.DIRECTOR },
          }),
          result: {
            items: [castMembers[3], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
          },
        },
      ];

      for (const item of arrange) {
        const searchOutput = await repository.search(item.params);
        const { items, filter, ...otherOutput } = searchOutput;
        const { items: itemsExpected, ...otherExpected } = item.result;
        expect(otherOutput).toMatchObject(otherExpected);
        expect(filter.type.value).toBe(item.params.filter.type.value);
        orderBy(searchOutput.items, ["name"]).forEach((item, key) => {
          expect(item.toJSON()).toStrictEqual(itemsExpected[key].toJSON());
        });
      }
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const castMembers = [
        CastMember.fake().anActor().withName("b").build(),
        CastMember.fake().anActor().withName("a").build(),
        CastMember.fake().anActor().withName("d").build(),
        CastMember.fake().anActor().withName("e").build(),
        CastMember.fake().anActor().withName("c").build(),
      ];
      await repository.bulkInsert(castMembers);

      const arrange = [
        {
          params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [castMembers[1], castMembers[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [castMembers[4], castMembers[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [castMembers[3], castMembers[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CastMemberRepository.SearchResult({
            items: [castMembers[4], castMembers[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });
    // CastMember.fake().anActor().withName("fake1").build(),
    // CastMember.fake().aDirector().withName("test fake").build(),
    describe("should search using filter by name, sort and paginate", () => {
      const castMembers = [
        CastMember.fake().anActor().withName("test").build(),
        CastMember.fake().anActor().withName("a").build(),
        CastMember.fake().anActor().withName("TEST").build(),
        CastMember.fake().anActor().withName("e").build(),
        CastMember.fake().aDirector().withName("TeSt").build(),
      ];

      let arrange = [
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: { name: "TEST" },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
        },
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: { name: "TEST" },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST" },
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          let result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });

    describe("should search using filter by type, sort and paginate", () => {
      const castMembers = [
        CastMember.fake().anActor().withName("test").build(),
        CastMember.fake().aDirector().withName("a").build(),
        CastMember.fake().anActor().withName("TEST").build(),
        CastMember.fake().aDirector().withName("e").build(),
        CastMember.fake().anActor().withName("TeSt").build(),
        CastMember.fake().aDirector().withName("b").build(),
        
      ];

      let arrange = [
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: { type: Types.ACTOR },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { type: CastMemberType.createAnActor() },
          }),
        },
        {
           search_params: CastMemberRepository.SearchParams.create({
             page: 2,
             per_page: 2,
             sort: "name",
             filter: { type: Types.ACTOR },
           }),
           search_result: new CastMemberRepository.SearchResult({
             items: [castMembers[0]],
             total: 3,
             current_page: 2,
             per_page: 2,
             sort: "name",
             sort_dir: "asc",
             filter: { type: CastMemberType.createAnActor() },
           }),
        },
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: { type: Types.DIRECTOR },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[1], castMembers[5]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { type: CastMemberType.createADirector() },
          }),
        },
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: { type: Types.DIRECTOR },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[3]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { type: CastMemberType.createADirector() },
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          let result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });

    describe("should search using filter by name and type, sort and paginate", () => {
      const castMembers = [
        CastMember.fake().anActor().withName("test").build(),
        CastMember.fake().aDirector().withName("a director").build(),
        CastMember.fake().anActor().withName("TEST").build(),
        CastMember.fake().aDirector().withName("e director").build(),
        CastMember.fake().anActor().withName("TeSt").build(),
        CastMember.fake().aDirector().withName("b director").build(),
        
      ];

      let arrange = [
        {
          search_params: CastMemberRepository.SearchParams.create({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: { name: "TEST", type: Types.ACTOR },
          }),
          search_result: new CastMemberRepository.SearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: { name: "TEST", type: CastMemberType.createAnActor() },
          }),
        },
        {
           search_params: CastMemberRepository.SearchParams.create({
             page: 2,
             per_page: 2,
             sort: "name",
             filter: { name: "TEST", type: Types.ACTOR },
           }),
           search_result: new CastMemberRepository.SearchResult({
             items: [castMembers[0]],
             total: 3,
             current_page: 2,
             per_page: 2,
             sort: "name",
             sort_dir: "asc",
             filter: { name: "TEST", type: CastMemberType.createAnActor() },
           }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          let result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });
  });
});
