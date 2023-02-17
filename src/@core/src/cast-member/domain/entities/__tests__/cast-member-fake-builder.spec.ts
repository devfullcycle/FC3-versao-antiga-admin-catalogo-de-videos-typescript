import { CastMemberFakeBuilder } from "../cast-member-fake-builder";
import { Chance } from "chance";
import { UniqueEntityId } from "../../../../@seedwork/domain";
import { CastMemberType, Types } from "../../value-objects";

describe("CastMemberFakerBuilder Unit Tests", () => {
  it("create cast member types", () => {
    let faker = CastMemberFakeBuilder.anActor();
    expect(faker.type).toBeInstanceOf(CastMemberType);
    expect(faker.type.value).toBe(Types.ACTOR);

    faker = CastMemberFakeBuilder.aDirector();
    expect(faker.type).toBeInstanceOf(CastMemberType);
    expect(faker.type.value).toBe(Types.DIRECTOR);

    const castMembers = CastMemberFakeBuilder.theCastMembers(2).build();
    expect(castMembers[0].type).toBeInstanceOf(CastMemberType);
    expect(castMembers[1].type).toBeInstanceOf(CastMemberType);
  });

  describe("unique_entity_id prop", () => {
    const faker = CastMemberFakeBuilder.anActor();

    it("should throw error when any with methods has called", () => {
      expect(() => faker["getValue"]("unique_entity_id")).toThrow(
        new Error(
          "Property unique_entity_id not have a factory, use 'with' methods"
        )
      );
    });

    it("should be undefined", () => {
      expect(faker["_unique_entity_id"]).toBeUndefined();
    });

    test("withUniqueEntityId", () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = faker.withUniqueEntityId(uniqueEntityId);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_unique_entity_id"]).toBe(uniqueEntityId);

      faker.withUniqueEntityId(() => uniqueEntityId);
      expect(faker["_unique_entity_id"]()).toBe(uniqueEntityId);

      expect(faker.unique_entity_id).toBe(uniqueEntityId);
    });

    it("should pass index to unique_entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      faker.withUniqueEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withUniqueEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe("name prop", () => {
    const faker = CastMemberFakeBuilder.anActor();
    it("should be a function", () => {
      expect(typeof faker["_name"] === "function").toBeTruthy();
    });

    it("should call the word method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withName", () => {
      const $this = faker.withName("test name");
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_name"]).toBe("test name");

      faker.withName(() => "test name");
      //@ts-expect-error name is callable
      expect(faker["_name"]()).toBe("test name");

      expect(faker.name).toBe("test name");
    });

    it("should pass index to name factory", () => {
      faker.withName((index) => `test name ${index}`);
      const castMember = faker.build();
      expect(castMember.name).toBe(`test name 0`);

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test("invalid empty case", () => {
      const $this = faker.withInvalidNameEmpty(undefined);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["_name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["_name"]).toBe("");
    });

    test("invalid too long case", () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_name"].length).toBe(256);

      const tooLong = "a".repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker["_name"].length).toBe(256);
      expect(faker["_name"]).toBe(tooLong);
    });
  });

  describe("type prop", () => {
    const faker = CastMemberFakeBuilder.anActor();
    it("should be a CastMemberType", () => {
      expect(faker["_type"]).toBeInstanceOf(CastMemberType);
    });

    test("withType", () => {
      const director = CastMemberType.createADirector();
      const $this = faker.withType(director);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker.type).toEqual(director);

      const actor = CastMemberType.createAnActor();
      faker.withType(() => actor);
      //@ts-expect-error name is callable
      expect(faker["_type"]()).toEqual(actor);
      expect(faker.type).toEqual(actor);
    });
  });

  describe("created_at prop", () => {
    const faker = CastMemberFakeBuilder.anActor();

    it("should throw error when any with methods has called", () => {
      expect(() => faker.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods")
      );
    });

    it("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker["_created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker["_created_at"]()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    it("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const castMember = faker.build();
      expect(castMember.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 0 + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });

  it("should create a cast member", () => {
    const faker = CastMemberFakeBuilder.anActor();
    let castMember = faker.build();

    expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(typeof castMember.name === "string").toBeTruthy();
    expect(castMember.type).toBeInstanceOf(CastMemberType);
    expect(castMember.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const actor = CastMemberType.createAnActor();
    const uniqueEntityId = new UniqueEntityId();
    castMember = faker
      .withUniqueEntityId(uniqueEntityId)
      .withName("name test")
      .withType(actor)
      .withCreatedAt(created_at)
      .build();

    expect(castMember.uniqueEntityId.value).toBe(uniqueEntityId.value);
    expect(castMember.name).toBe("name test");
    expect(castMember.type).toEqual(actor);
    expect(castMember.props.created_at).toEqual(created_at);
  });

  it("should create many cast members", () => {
    const faker = CastMemberFakeBuilder.theCastMembers(2);
    let castMembers = faker.build();

    castMembers.forEach((castMember) => {
      expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
      expect(typeof castMember.name === "string").toBeTruthy();
      expect(castMember.type).toBeInstanceOf(CastMemberType);
      expect(castMember.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const actor = CastMemberType.createAnActor();
    const uniqueEntityId = new UniqueEntityId();
    castMembers = faker
      .withUniqueEntityId(uniqueEntityId)
      .withName("name test")
      .withType(actor)
      .withCreatedAt(created_at)
      .build();

    castMembers.forEach((castMember) => {
      expect(castMember.uniqueEntityId.value).toBe(uniqueEntityId.value);
      expect(castMember.name).toBe("name test");
      expect(castMember.type).toBeInstanceOf(CastMemberType);
      expect(castMember.props.created_at).toEqual(created_at);
    });
  });
});
