const { objectType, stringArg } = require("@nexus/schema");

const User = objectType({
  name: "user",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
  },
});
const Exercise = objectType({
  name: "exercise",
  definition(t) {
    t.model.id();
    t.model.label();
    t.model.name();
  },
});
const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signupUser", {
      type: "user",
      args: {
        email: stringArg(),
        name: stringArg({ nullable: true }),
      },
      resolve: (_, { name, email }, ctx, _info) => {
        return ctx.prisma.user.create({
          data: {
            name,
            email,
          },
        });
      },
    });
    t.field("createExercise", {
      type: "exercise",
      args: {
        name: stringArg(),
        label: stringArg({ nullable: true }),
      },
      resolve: (_, { name, label }, ctx, _info) => {
        return ctx.prisma.exercise.create({
          data: {
            name,
            label,
          },
        });
      },
    });
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
    t.list.field("users", {
      type: "user",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.user.findMany();
      },
    });
    t.list.field("exercises", {
      type: "exercise",
      resolve: (_, _args, ctx) => {
        return ctx.prisma.exercise.findMany();
      },
    });
  },
});

module.exports = {
  User,
  Exercise,
  Mutation,
  Query,
};
