import { Post } from "../entities/Post";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "../types";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    await sleep(3000);
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true }) //graphql type
  post(
    @Arg('id', () => Int) id: number, //explicitly listing type is optional, graphql infers type
    @Ctx() { em }: MyContext
  ): Promise<Post | null> { //typescript type
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post) 
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> { //typescript type
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true }) 
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string, //type has to be explicitly specified for nullable true 
    @Ctx() { em }: MyContext
  ): Promise<Post | null> { 
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  // @Mutation(() => Boolean) 
  // async deletePost(
  //   @Arg('id') id: number, 
  //   @Ctx() { em }: MyContext
  // ) : Promise<boolean> {
  //   try {
  //     await em.nativeDelete(Post, { id })
  //   } catch {
  //     return false;
  //   }
  //   return true;
  // }

  @Mutation(() => Post, { nullable: true })
  async deletePost(
    @Arg('id') id:number,
    @Ctx() { em }: MyContext
  ) : Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (post) {
      await em.nativeDelete(Post, { id })
      return post;
    } else {
      return null;
    }
  }
}
