import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  rating: number;

  @Field()
  @Column()
  comment: string;

  @Field()
  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.reviewsAsAuthor)
  @Field(() => User)
  author: User;

  @ManyToOne(() => User, (user) => user.reviewsAsTarget)
  @Field(() => User)
  target: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
