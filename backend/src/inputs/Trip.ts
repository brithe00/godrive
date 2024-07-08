import { Field, InputType } from "type-graphql";

@InputType()
export class TripInput {
  @Field()
  date: Date;

  @Field()
  price: number;

  @Field()
  status: string;

  @Field()
  numberOfPassengers: number;

  @Field()
  startLocation: string;

  @Field({ nullable: true })
  stopLocations?: string;

  @Field()
  endLocation: string;

  @Field()
  vehicleType: string;

  @Field({ nullable: true })
  vehicleModel?: string;

  @Field({ nullable: true })
  licensePlateNumber?: string;

  @Field()
  estimatedDuration: number;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}
