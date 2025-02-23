import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import { checkIfRegisteredOrIsAdmin } from "../utils/checker";
import { UserContext } from "../types/User";
import { UserUpdateAdmin } from "../inputs/User";

import { redisClient } from "../index";

@ObjectType()
@Resolver()
export class UserAdminResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: UserContext): Promise<User[]> {
    checkIfRegisteredOrIsAdmin(ctx.user);

    try {
      const cachedResult = await redisClient.get("users");

      if (cachedResult !== null) {
        return JSON.parse(cachedResult);
      } else {
        const users = await User.find({
          relations: [
            "trips.passengers",
            "reviewsAsAuthor.author",
            "reviewsAsAuthor.target",
            "reviewsAsTarget.author",
            "reviewsAsTarget.target",
          ],
        });

        redisClient.set("users", JSON.stringify(users), { EX: 3600 });

        return users;
      }
    } catch (error) {
      throw new Error("Failed to fetch users: " + error.message);
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("id") id: string,
    @Arg("input") input: UserUpdateAdmin,
    @Ctx() ctx: UserContext
  ): Promise<User> {
    checkIfRegisteredOrIsAdmin(ctx.user);

    try {
      const userToUpdate = await User.findOne({
        where: {
          id,
        },
      });

      if (!userToUpdate) {
        throw new Error("User not found !");
      }

      const newUser = await User.save({
        ...userToUpdate,
        ...input,
      });

      return newUser;
    } catch (error) {
      throw new Error("Failed to update user: " + error.message);
    }
  }

  @Mutation(() => User)
  async updateRoleForUser(
    @Arg("id") id: string,
    @Ctx() ctx: UserContext
  ): Promise<User> {
    checkIfRegisteredOrIsAdmin(ctx.user);

    try {
      const userToUpdate = await User.findOne({
        where: {
          id,
        },
      });

      if (!userToUpdate) {
        throw new Error("User not found !");
      }

      let isAdminValue = userToUpdate.isAdmin;

      const newUser = await User.save({
        ...userToUpdate,
        isAdmin: !isAdminValue,
      });

      return newUser;
    } catch (error) {
      throw new Error(
        "Failed to change the role for the user: " + error.message
      );
    }
  }

  @Mutation(() => String)
  async deleteUser(
    @Arg("id") id: string,
    @Ctx() ctx: UserContext
  ): Promise<String> {
    checkIfRegisteredOrIsAdmin(ctx.user);
    try {
      await User.delete(id);
      return `User #${id} deleted !`;
    } catch (error) {
      throw new Error("Failed to fetch users: " + error.message);
    }
  }
}
