import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  registerEnumType,
} from "type-graphql";
import { Trip } from "../entities/trip";
import { TripInput } from "../inputs/Trip";
import { TripUpdateInput } from "../inputs/TripUpdate";
import { UserContext } from "../types/User";
import { User } from "../entities/user";
import { checkIfRegistered } from "../utils/checker";

import { Between } from "typeorm";

enum SortBy {
  DATE = "DATE",
  START_TIME = "START_TIME",
  PRICE = "PRICE",
}

registerEnumType(SortBy, {
  name: "SortBy",
});

@Resolver()
export class TripResolver {
  @Query(() => [Trip])
  async trips(): Promise<Trip[]> {
    try {
      return Trip.find({ relations: ["passengers", "driver"] });
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      throw error;
    }
  }

  @Query(() => [Trip])
  async tripsForUser(
    @Arg("userId", () => String) userId: string
  ): Promise<Trip[]> {
    try {
      const trips = await Trip.find({
        where: {
          driver: {
            id: userId,
          },
        },
        order: {
          createdAt: "DESC",
        },
      });

      return trips;
    } catch (error) {
      console.error("Failed to fetch trips for user:", error);
      throw error;
    }
  }

  @Mutation(() => Trip)
  async createTrip(
    @Arg("input") input: TripInput,
    @Ctx() ctx: UserContext
  ): Promise<Trip> {
    checkIfRegistered(ctx.user);

    try {
      const user = await User.findOneOrFail({
        where: {
          id: ctx.user.id,
        },
      });

      const trip = await Trip.save({
        ...input,
        driver: user,
      });

      return trip;
    } catch (error) {
      console.error("Failed to create trip:", error);
      throw error;
    }
  }

  @Mutation(() => Trip)
  async updateTrip(
    @Arg("id") id: string,
    @Arg("data") data: TripUpdateInput,
    @Ctx() ctx: UserContext
  ): Promise<Trip> {
    checkIfRegistered(ctx.user);

    try {
      const tripToUpdate = await Trip.findOne({ where: { id } });

      if (!tripToUpdate) throw new Error("Trip not found!");

      if (tripToUpdate.driver.id !== ctx.user.id) {
        throw new Error("You are not authorized to update this trip!");
      }

      const newTrip = await Trip.save({
        ...tripToUpdate,
        ...data,
      });

      return newTrip;
    } catch (error) {
      console.error("Failed to update trip:", error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteTrip(
    @Arg("id") id: string,
    @Ctx() ctx: UserContext
  ): Promise<boolean> {
    checkIfRegistered(ctx.user);

    try {
      const trip = await Trip.findOne({ where: { id } });
      if (!trip) throw new Error("Trip not found!");

      if (trip.driver.id !== ctx.user.id) {
        throw new Error("You are not authorized to delete this trip!");
      }

      await Trip.remove(trip);
      return true;
    } catch (error) {
      console.error("Failed to delete trip:", error);
      throw error;
    }
  }

  @Query(() => Trip)
  async trip(@Arg("id") id: string) {
    try {
      const trip = await Trip.findOne({
        where: { id },
        relations: ["passengers", "driver"],
      });

      if (!trip) throw new Error("Trip not found");
      return trip;
    } catch (error) {
      throw new Error(
        "Could not fetch trip. Please try again later. " + error.message
      );
    }
  }

  @Mutation(() => Trip)
  async addPassenger(
    @Arg("tripId") tripId: string,
    @Ctx() ctx: UserContext
  ): Promise<Trip> {
    checkIfRegistered(ctx.user);
    try {
      const trip = await Trip.findOne({
        where: { id: tripId },
        relations: ["driver", "passengers"],
      });
      if (!trip) throw new Error("Trip not found");
      if (trip.driver.id === ctx.user.id)
        throw new Error("Driver cannot be passenger");

      const newPassenger = await User.findOne({
        where: { id: ctx.user.id },
      });
      if (!newPassenger) throw new Error("User not found");

      const alreadyPassenger = trip.passengers.find(
        (passenger) => passenger.id === newPassenger.id
      );
      if (alreadyPassenger) {
        throw new Error("Passenger is already added to this trip");
      }

      if (
        trip.passengers.length === trip.numberOfPassengers ||
        trip.status === "fulled"
      )
        throw new Error("No place available for this trip");
      trip.passengers.push(newPassenger);
      await trip.save();

      return trip;
    } catch (error) {
      throw new Error("Failed to add pasenger: " + error.message);
    }
  }

  @Mutation(() => Trip)
  async removePassenger(
    @Arg("tripId") tripId: string,
    @Ctx() ctx: UserContext
  ): Promise<Trip> {
    checkIfRegistered(ctx.user);
    try {
      const trip = await Trip.findOne({
        where: { id: tripId },
        relations: ["driver", "passengers"],
      });
      if (!trip) throw new Error("Trip not found");
      if (trip.driver.id === ctx.user.id)
        throw new Error("Driver cannot be removed as passenger");

      const passengerToRemove = await User.findOne({
        where: { id: ctx.user.id },
      });
      if (!passengerToRemove) throw new Error("User not found");

      const passengerIndex = trip.passengers.findIndex(
        (passenger) => passenger.id === passengerToRemove.id
      );
      if (passengerIndex === -1) {
        throw new Error("Passenger not found in this trip");
      }

      trip.passengers.splice(passengerIndex, 1);
      await trip.save();

      return trip;
    } catch (error) {
      throw new Error("Failed to remove pasenger: " + error.message);
    }
  }

  @Query(() => [Trip])
  async searchTrips(
    @Arg("startLocation") startLocation: string,
    @Arg("endLocation") endLocation: string,
    @Arg("date", { nullable: true }) date: Date,
    @Arg("sortBy", () => [SortBy], { nullable: true }) sortBy: SortBy[]
  ): Promise<Trip[]> {
    try {
      if (!startLocation) {
        throw new Error("Departure location is required.");
      }

      if (!endLocation) {
        throw new Error("Arrival location is required.");
      }

      const whereClause: any = {
        startLocation,
        endLocation,
      };

      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        whereClause.date = Between(startDate, endDate);
      }

      const options: any = {
        where: whereClause,
        relations: ["driver", "passengers"],
      };

      if (sortBy && sortBy.length > 0) {
        options.order = {};
        const primarySort = sortBy[0];
        switch (primarySort) {
          case SortBy.DATE:
            options.order["date"] = "ASC";
            break;
          case SortBy.START_TIME:
            options.order["startTime"] = {
              direction: "ASC",
              nulls: "NULLS FIRST",
            };
            break;
          case SortBy.PRICE:
            options.order["price"] = "ASC";
            break;
          default:
            break;
        }
      }

      const trips = await Trip.find(options);
      return trips;
    } catch (error) {
      console.error("Error occurred while fetching trips:", error);
      throw new Error(error.message);
    }
  }
}

// remove passenger
