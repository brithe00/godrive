import "reflect-metadata";
import { TripResolver } from "../src/resolvers/Trip";
import { TripInput } from "../src/inputs/Trip";
import { UserContext } from "../src/types/User";
import { Trip } from "../src/entities/trip";
import { User } from "../src/entities/user";

// Mock TypeGraphQL decorators and functions
jest.mock("type-graphql", () => ({
  Resolver: () => jest.fn(),
  Query: () => jest.fn(),
  Mutation: () => jest.fn(),
  Arg: () => jest.fn(),
  Ctx: () => jest.fn(),
  InputType: () => jest.fn(),
  Field: () => jest.fn(),
  ObjectType: () => jest.fn(),
  Int: jest.fn(),
  Float: jest.fn(),
  ID: jest.fn(),
  registerEnumType: jest.fn(),
}));

// Mock TypeORM decorators and functions
jest.mock("typeorm", () => ({
  Entity: () => jest.fn(),
  PrimaryGeneratedColumn: () => jest.fn(),
  Column: () => jest.fn(),
  CreateDateColumn: () => jest.fn(),
  UpdateDateColumn: () => jest.fn(),
  ManyToOne: () => jest.fn(),
  OneToMany: () => jest.fn(),
  ManyToMany: () => jest.fn(),
  JoinTable: () => jest.fn(),
  JoinColumn: () => jest.fn(),
  BaseEntity: class {},
  getRepository: jest.fn(),
}));

// Mock the Trip entity
jest.mock("../src/entities/trip", () => ({
  Trip: {
    create: jest.fn(),
    save: jest.fn(),
  },
}));

// Mock the User entity
jest.mock("../src/entities/user", () => ({
  User: {
    findOneOrFail: jest.fn(),
  },
}));

describe("TripResolver", () => {
  let tripResolver: TripResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    tripResolver = new TripResolver();
  });

  describe("createTrip", () => {
    const mockContext: UserContext = {
      user: {
        id: "1",
        email: "admin@example.com",
        isAdmin: true,
        iat: 1234567890,
      },
    };

    const tripInput: TripInput = {
      date: new Date("2024-07-24"),
      price: 100,
      status: "Active",
      startLocation: "New York",
      stopLocations: "Philadelphia",
      endLocation: "Washington D.C.",
      numberOfPassengers: 2,
      startTime: "08:00",
      endTime: "12:00",
      estimatedDuration: 240,
      vehicleType: "car",
      vehicleModel: "Toyota Camry",
      licensePlateNumber: "ABC-1234",
    };

    it("should create a new trip successfully", async () => {
      const mockUser = { id: "1", isAdmin: true };
      const mockTrip = { id: "trip1", ...tripInput };

      (User.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);
      (Trip.save as jest.Mock).mockResolvedValue(mockTrip);

      const result = await tripResolver.createTrip(tripInput, mockContext);

      expect(result).toEqual(mockTrip);
      expect(User.findOneOrFail).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(Trip.save).toHaveBeenCalledWith(
        expect.objectContaining(tripInput)
      );
    });

    it("should throw an error if user is not found or not an admin", async () => {
      (User.findOneOrFail as jest.Mock).mockRejectedValue(
        new Error("User not found")
      );

      await expect(
        tripResolver.createTrip(tripInput, mockContext)
      ).rejects.toThrow("User not found");
      expect(Trip.save).not.toHaveBeenCalled();
    });

    it("should throw an error if trip creation fails", async () => {
      const mockUser = { id: "1", isAdmin: true };
      (User.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);
      (Trip.save as jest.Mock).mockRejectedValue(
        new Error("Failed to save trip")
      );

      await expect(
        tripResolver.createTrip(tripInput, mockContext)
      ).rejects.toThrow("Failed to save trip");
      expect(Trip.save).toHaveBeenCalledWith(
        expect.objectContaining(tripInput)
      );
    });

    it("should handle invalid input", async () => {
      const mockUser = { id: "1", isAdmin: true };
      const invalidInput = { ...tripInput, price: -100 };
      (User.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);
      (Trip.save as jest.Mock).mockRejectedValue(new Error("Invalid input"));

      await expect(
        tripResolver.createTrip(invalidInput as TripInput, mockContext)
      ).rejects.toThrow("Invalid input");
      expect(Trip.save).toHaveBeenCalledWith(
        expect.objectContaining(invalidInput)
      );
    });
  });
});
