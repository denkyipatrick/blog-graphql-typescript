import {
  extendType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.id("id");
    t.string("title");
    t.string("body");
    t.boolean("published");
  },
});

export const PostsQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("drafts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.prisma.post.findMany({ where: { published: false } });
      },
    });
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.prisma.post.findMany({ where: { published: true } });
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        const post = ctx.prisma.post.create({
          data: {
            title: args.title,
            body: args.body,
            published: false,
          },
        });

        return post;
      },
    });
    t.field("publish", {
      type: "Post",
      args: {
        draftId: intArg(),
      },
      resolve(_root, args, ctx) {
        return ctx.prisma.post.update({
          where: { id: args.draftId },
          data: {
            published: true,
          },
        });
      },
    });
  },
});
