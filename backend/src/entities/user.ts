import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Trip } from "./trip";
import { Review } from "./review";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  pictureUrl: string;

  @Field()
  @Column()
  birthdate: Date;

  @Field()
  @Column()
  phoneNumber: string;

  @Field()
  @Column({
    default: false,
  })
  isAdmin: boolean;

  @Field(() => [Trip])
  @ManyToMany(() => Trip, (trip) => trip.passengers, { onDelete: "CASCADE" })
  trips: Trip[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.author, {
    onDelete: "CASCADE",
  })
  reviewsAsAuthor: Review[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.target, {
    onDelete: "CASCADE",
  })
  reviewsAsTarget: Review[];

  @Field(() => [Trip])
  @OneToMany(() => Trip, (trip) => trip.driver, {
    onDelete: "CASCADE",
  })
  tripsAsDriver: Trip[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
