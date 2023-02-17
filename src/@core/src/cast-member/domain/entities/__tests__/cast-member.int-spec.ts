import { CastMemberType } from "../../value-objects";
import { CastMember } from "../cast-member";

describe("CastMember Integration Tests", () => {
  describe("create method", () => {
    it("should a invalid cast member using name property", () => {
      expect(() => new CastMember({ name: null } as any)).containsErrorMessages(
        {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        }
      );

      expect(() => new CastMember({ name: "" } as any)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => new CastMember({ name: 5 } as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(
        () => new CastMember({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a invalid cast member using type property", () => {
      expect(() => new CastMember({ type: null } as any)).containsErrorMessages(
        {
          type: [
            "type should not be empty",
            "type must be an instance of CastMemberType",
          ],
        }
      );

      expect(() => new CastMember({ type: 5 } as any)).containsErrorMessages({
        type: ["type must be an instance of CastMemberType"],
      });
    });

    it("should a valid cast member", () => {
      expect.assertions(0);
      
      /* NOSONAR*/ new CastMember({
        name: "test",
        type: CastMemberType.createADirector(),
      });
    });
  });

  describe("update method", () => {
    it("should a invalid cast member using name property", () => {
      const castMember = CastMember.fake().anActor().build();
      expect(() => castMember.update(null, null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => castMember.update("", null)).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => castMember.update(5 as any, null)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        castMember.update("t".repeat(256), null)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should a invalid cast member using type property", () => {
      const castMember = CastMember.fake().anActor().build();
      expect(() => castMember.update(null, null)).containsErrorMessages({
        type: [
          "type should not be empty",
          "type must be an instance of CastMemberType",
        ],
      });

      expect(() => castMember.update(null, 5 as any)).containsErrorMessages({
        type: ["type must be an instance of CastMemberType"],
      });
    });

    it("should a valid cast member", () => {
      expect.assertions(0);
      const castMember = CastMember.fake().anActor().build();
      castMember.update(
        "name changed",
        CastMemberType.createADirector()
      );
    });
  });
});
