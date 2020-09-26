import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Mutation, InputType, Field, Arg, Ctx, ObjectType } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
class UserResponse {
  @Field()
  errors?: Error[];

  @Field()
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, { 
      username: options.username, 
      password: hashedPassword, 
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ name: }]
      }
    }

    const hashedPassword = await argon2.hash(options.password);
    return user;
  }
}
