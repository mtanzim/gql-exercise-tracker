const { GraphQLServer } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");
const { makeSchema } = require("@nexus/schema");
const { nexusPrismaPlugin } = require("nexus-prisma");
const { User, Exercise, Query, Mutation } = require("./nexusModels");

const prisma = new PrismaClient();

const server = new GraphQLServer({
  schema: makeSchema({
    types: [User, Exercise, Query, Mutation],
    plugins: [nexusPrismaPlugin({ experimentalCRUD: true })],
    outputs: {
      schema: __dirname + "/../schema.graphql",
      typegen: __dirname + "/generated/nexus.ts",
    },
  }),
  context: { prisma },
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
