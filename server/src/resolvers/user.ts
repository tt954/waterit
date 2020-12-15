import { 
  Resolver, 
  Mutation, 
  Field, 
  Arg, 
  Ctx, 
  ObjectType, 
  Query } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import { EntityManager } from '@mikro-orm/postgresql';
import { COOKIE_NAME } from "../constants";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validateRegister } from "src/utils/validateRegister";

@ObjectType() 
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}



@Resolver()
export class UserResolver {


  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em }: MyContext
  ) {
    // const user = await em.findOne(User, { email });
    return true;
  }


  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { em, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null // not logged in 
    }

    const user = await em.findOne(User, { id: req.session.userId })
    return user; 
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) : Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user; 
    try {
      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
        email: options.email,
        username: options.username,
        password: hashedPassword, 
        created_at: new Date(),
        updated_at: new Date()
      }).returning("*");

      user = result[0];
      // await em.persistAndFlush(user);
    } catch(err) {
      if (err.code === "23505") {
        return {
          errors: [{
            field: "username",
            message: "Username already exists"
          }]
        }
      }
    }

    // store user id session, set cookie, keeps user logged in
    console.log("current user", user);
    req.session.userId = user.id; 

    return { user };
  }


  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail : string,
    @Arg('password') password : string,
    @Ctx() { em, req }: MyContext
  ) : Promise<UserResponse> {
    const user = await em.findOne(
      User, 
      usernameOrEmail.includes('@') 
        ? { email: usernameOrEmail } 
        : { username: usernameOrEmail }
      );
    if (!user) {
      return {
        errors: [{ 
          field: "username",
          message: "Username does not exist"
        }]
      }
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id; 
    
    return { user };
  }


  @Mutation(() => Boolean)
  logout (@Ctx() { req, res }: MyContext) {
    return new Promise(resolve => 
      req.session.destroy(err => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false)
          return;
        } 
        resolve(true);
      })
    );
  }
}
