import { Resolver, Query, Mutation, Arg, Int, Ctx } from "type-graphql";
import { Review } from "../entities/review";
import { UserContext } from "../types/User";
import { User } from "../entities/user";
import { checkIfRegistered } from "../utils/checker";
import { redisClient } from "../index";

@Resolver()
export class ReviewResolver {
  @Query(() => [Review])
  async reviews(): Promise<Review[]> {
    return await Review.find({ relations: ["author", "target"] });
  }

  @Query(() => [Review])
  async reviewsForUser(
    @Arg("userId", () => String) userId: string
  ): Promise<Review[]> {
    const redisKey = `user:${userId}:reviews`;

    try {
      const cachedReviews = await redisClient.get(redisKey);

      if (cachedReviews !== null) {
        return JSON.parse(cachedReviews);
      } else {
        const reviews = await Review.find({
          where: {
            target: {
              id: userId,
            },
          },
          relations: ["author", "target"],
          order: {
            createdAt: "DESC",
          },
        });

        await redisClient.set(redisKey, JSON.stringify(reviews), { EX: 3600 });

        return reviews;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des critiques :", error);
      throw new Error("Impossible de récupérer les critiques");
    }
  }

  @Query(() => [Review])
  async reviewsAsAuthor(
    @Arg("userId", () => String) authorId: string
  ): Promise<Review[]> {
    try {
      const reviews = await Review.find({
        where: {
          author: {
            id: authorId,
          },
        },
        relations: ["author", "target"],
        order: {
          createdAt: "DESC",
        },
      });

      return reviews;
    } catch (error) {
      console.error("Error fetching reviews by author:", error);
      throw new Error("Unable to fetch reviews by author");
    }
  }

  @Mutation(() => Boolean)
  async deleteReview(
    @Arg("reviewId", () => String) reviewId: string,
    @Ctx() ctx: UserContext
  ): Promise<Boolean> {
    try {
      checkIfRegistered(ctx.user);
      const review = await Review.findOne({
        where: { id: reviewId },
        relations: ["author"],
      });
      if (!review) throw new Error("Review not found!");

      if (review.author.id !== ctx.user.id) {
        throw new Error("You are not authorized to delete this review!");
      }

      await Review.remove(review);
      return true;
    } catch (error) {
      console.error("Failed to delete review:", error);
      return false;
    }
  }

  @Mutation(() => Review)
  async createReview(
    @Arg("rating", () => Int) rating: number,
    @Arg("comment") comment: string,
    @Arg("title") title: string,
    @Arg("targetId", () => String) targetId: string,
    @Ctx() ctx: UserContext
  ): Promise<Review> {
    checkIfRegistered(ctx.user);
    const me = await User.findOne({ where: { id: ctx.user.id } });
    if (!me) throw new Error("User not found!");

    const targetUser = await User.findOne({ where: { id: targetId } });
    if (!targetUser) throw new Error("User not found!");

    if (me.id === targetId) {
      throw new Error("Cannot review yourself !");
    }

    const existingReview = await Review.findOne({
      where: {
        author: { id: me.id },
        target: { id: targetId },
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this user!");
    }

    const review = new Review();
    review.rating = rating;
    review.comment = comment;
    review.title = title;
    review.author = me;
    review.target = targetUser;

    await review.save();
    return review;
  }
}
