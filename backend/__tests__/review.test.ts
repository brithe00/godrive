import "reflect-metadata";
import { ReviewResolver } from "../src/resolvers/Review";
import { Review } from "../src/entities/review";
import { User } from "../src/entities/user";
import { UserContext } from "../src/types/User";

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
  BaseEntity: class {
    static find = jest.fn();
    static findOne = jest.fn();
    static remove = jest.fn();
  },
}));

describe("ReviewResolver", () => {
  let resolver: ReviewResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    resolver = new ReviewResolver();
  });

  describe("deleteReview", () => {
    const mockContext: UserContext = {
      user: {
        id: "1",
        email: "test@example.com",
        isAdmin: false,
        iat: 1515151,
      },
    };

    it("should delete the review with the given reviewId", async () => {
      const reviewId = "1";
      const mockReview: Partial<Review> = {
        id: reviewId,
        rating: 5,
        comment: "Great product!",
        title: "Excellent",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: "1" } as User,
      };

      (Review.findOne as jest.Mock).mockResolvedValueOnce(mockReview as Review);
      (Review.remove as jest.Mock).mockResolvedValueOnce({} as any);

      const result = await resolver.deleteReview(reviewId, mockContext);
      expect(result).toBe(true);
      expect(Review.findOne).toHaveBeenCalledWith({
        where: { id: reviewId },
        relations: ["author"],
      });
      expect(Review.remove).toHaveBeenCalledWith(mockReview);
    });

    it("should return false if the review is not found", async () => {
      const reviewId = "999";
      (Review.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await resolver.deleteReview(reviewId, mockContext);
      expect(result).toBe(false);
      expect(Review.findOne).toHaveBeenCalledWith({
        where: { id: reviewId },
        relations: ["author"],
      });
      expect(Review.remove).not.toHaveBeenCalled();
    });

    it("should return false if the user is not authorized to delete the review", async () => {
      const reviewId = "1";
      const mockReview: Partial<Review> = {
        id: reviewId,
        rating: 5,
        comment: "Great product!",
        title: "Excellent",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { id: "2" } as User,
      };

      (Review.findOne as jest.Mock).mockResolvedValueOnce(mockReview as Review);

      const result = await resolver.deleteReview(reviewId, mockContext);
      expect(result).toBe(false);
      expect(Review.findOne).toHaveBeenCalledWith({
        where: { id: reviewId },
        relations: ["author"],
      });
      expect(Review.remove).not.toHaveBeenCalled();
    });
  });
});
