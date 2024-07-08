import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";

@ObjectType()
@Entity()
export class Trip extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column({ default: "new" })
  status: string; // e.g., "created", "in-progress", "completed", "cancelled"

  @Field()
  @Column()
  numberOfPassengers: number;

  @Field()
  @Column()
  startLocation: string;

  @Field()
  @Column()
  stopLocations: string;

  @Field()
  @Column()
  endLocation: string;

  @Field()
  @Column()
  vehicleType: string; // e.g., "SUV"

  @Field()
  @Column()
  vehicleModel: string; // e.g., "Toyota Highlander"

  @Field()
  @Column()
  licensePlateNumber: string; // e.g., "ABC-1234"

  @Field()
  @Column({ type: "int" })
  estimatedDuration: number; // e.g., 180 (minutes)

  @Field()
  @Column()
  startTime: string;

  @Field()
  @Column()
  endTime: string;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.trips, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  passengers: User[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tripsAsDriver, {
    onDelete: "CASCADE",
  })
  driver: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
