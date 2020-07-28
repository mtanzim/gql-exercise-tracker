const { GraphQLServer, PubSub } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");
const { makeSchema } = require("@nexus/schema");
const { nexusPrismaPlugin } = require("nexus-prisma");
const { getUserId } = require("./utils");
const {
  User,
  AuthPayload,
  Exercise,
  ExerciseSession,
  ExerciseInstance,
  Message,
  MessageSubscription,
  Query,
  Mutation,
} = require("./models");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new GraphQLServer({
  schema: makeSchema({
    types: [
      User,
      AuthPayload,
      Exercise,
      ExerciseSession,
      ExerciseInstance,
      Message,
      MessageSubscription,
      Query,
      Mutation,
    ],
    plugins: [
      nexusPrismaPlugin({
        experimentalCRUD: true,
        // remove user and timestamp fields from input types
        computedInputs: {
          user: ({ _args, ctx, _info }) => ({
            connect: {
              id: getUserId(ctx),
            },
          }),
          timestamp: ({ _args, ctx, _info }) => ({}),
        },
      }),
    ],
    outputs: {
      schema: __dirname + "/../schema.graphql",
      typegen: __dirname + "/generated/nexus.ts",
    },
  }),
  context: (request) => ({ ...request, prisma, pubsub }),
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
