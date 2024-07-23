import "reflect-metadata";
import { UserResolver } from "../src/resolvers/User";
import { User } from "../src/entities/user";

// Mock TypeGraphQL decorators and functions
jest.mock("type-graphql", () => ({
  Resolver: () => jest.fn(),
  Query: () => jest.fn(),
  Mutation: () => jest.fn(),
  Arg: () => jest.fn(),
  Ctx: () => jest.fn(),
  Field: () => jest.fn(),
  ObjectType: () => jest.fn(),
  InputType: () => jest.fn(),
  Int: jest.fn(),
  Float: jest.fn(),
  ID: jest.fn(),
}));

// Mock TypeORM decorators and functions
jest.mock("typeorm", () => ({
  JoinTable: () => jest.fn(),
  Entity: () => jest.fn(),
  PrimaryGeneratedColumn: () => jest.fn(),
  Column: () => jest.fn(),
  CreateDateColumn: () => jest.fn(),
  UpdateDateColumn: () => jest.fn(),
  OneToMany: () => jest.fn(),
  ManyToMany: () => jest.fn(),
  ManyToOne: () => jest.fn(),
  BaseEntity: class {
    static find = jest.fn();
    static findOne = jest.fn();
  },
}));

jest.mock("../src/entities/trip", () => ({
  Trip: jest.fn(),
}));

describe("User Resolvers", () => {
  let userResolver: UserResolver;

  const mockUsers: Partial<User>[] = [
    {
      id: "1",
      email: "brian@example.com",
      firstname: "Brian",
      lastname: "Thellier",
      description: "Ceci est une description",
      pictureUrl: "http://",
      phoneNumber: "0600000000",
      isAdmin: true,
    },
    {
      id: "2",
      email: "pasbrian@example.com",
      firstname: "pasBrian",
      lastname: "pasThellier",
      description: "pasCeci est une description",
      pictureUrl: "pashttp://",
      phoneNumber: "pas0600000000",
      isAdmin: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    userResolver = new UserResolver();
  });

  describe("UserResolver", () => {
    describe("getUserById", () => {
      it("should return a user by id", async () => {
        const userId = "1";
        (User.findOne as jest.Mock).mockResolvedValue(mockUsers[0]);

        const result = await userResolver.getUserById(userId);

        expect(result).toEqual(mockUsers[0]);
        expect(User.findOne).toHaveBeenCalledWith({
          where: { id: userId },
          relations: ["reviewsAsTarget.target", "tripsAsDriver.driver"],
        });
      });

      it("should throw an error if user is not found", async () => {
        const userId = "999";
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await expect(userResolver.getUserById(userId)).rejects.toThrow(
          "Failed to fetch user: User not found !"
        );
        expect(User.findOne).toHaveBeenCalledWith({
          where: { id: userId },
          relations: ["reviewsAsTarget.target", "tripsAsDriver.driver"],
        });
      });
    });
  });
});
