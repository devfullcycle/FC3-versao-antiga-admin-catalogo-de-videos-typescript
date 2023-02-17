import { CastMember, CastMemberProperties } from "#cast-member/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { CastMemberType } from "../../value-objects/cast-member-type.vo";

describe("CastMember Unit Tests", () => {
  beforeEach(() => {
    CastMember.validate = jest.fn();
  });
  test("constructor of cast member", () => {
    const director = CastMemberType.createADirector();
    let castMember = new CastMember({
      name: "test",
      type: director,
    });
    expect(CastMember.validate).toHaveBeenCalled();
    expect(castMember.props).toStrictEqual({
      name: "test",
      type: director,
      created_at: castMember.props.created_at,
    });
    expect(castMember.props.created_at).toBeInstanceOf(Date);

    let created_at = new Date(); //string
    castMember = new CastMember({
      name: "test",
      type: director,
      created_at,
    });
    expect(castMember.props).toStrictEqual({
      name: "test",
      type: director,
      created_at,
    });
  });

  describe("id field", () => {
    type CastMemberData = { props: CastMemberProperties; id?: UniqueEntityId };
    const actor = CastMemberType.createADirector();
    const arrange: CastMemberData[] = [
      { props: { name: "Movie", type: actor } },
      { props: { name: "Movie", type: actor }, id: null },
      { props: { name: "Movie", type: actor }, id: undefined },
      { props: { name: "Movie", type: actor }, id: new UniqueEntityId() },
    ];

    test.each(arrange)("when props is %j", (item) => {
      const castMember = new CastMember(item.props, item.id as any);
      expect(castMember.id).not.toBeNull();
      expect(castMember.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test("getter and setter of name prop", () => {
    const castMember = CastMember.fake().anActor().build();
    expect(castMember.name).toBe(castMember.props.name);

    castMember["name"] = "other name";
    expect(castMember.name).toBe("other name");
  });

  test("getter and setter of type prop", () => {
    let castMember = CastMember.fake().anActor().build();
    expect(castMember.type).toEqual(castMember.props.type);

    const director = CastMemberType.createADirector();
    castMember["type"] = director;
    expect(castMember.type).toEqual(director);
  });

  test("getter of created_at prop", () => {
    let castMember = CastMember.fake().anActor().build();
    expect(castMember.created_at).toBeInstanceOf(Date);

    let created_at = new Date();
    castMember = CastMember.fake().anActor().withCreatedAt(created_at).build();
    expect(castMember.created_at).toBe(created_at);
  });

  it("should update a cast member", () => {
    const director = CastMemberType.createADirector();
    const castMember = new CastMember({ name: "test", type: director });
    const actor = CastMemberType.createAnActor();
    castMember.update("test1", actor);
    
    expect(CastMember.validate).toHaveBeenCalledTimes(2);
    expect(castMember.name).toBe("test1");
    expect(castMember.type).toEqual(actor);
  });
});
