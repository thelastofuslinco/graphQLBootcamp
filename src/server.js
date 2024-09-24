const { createServer } = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

const { PrismaClient } = require("@prisma/client");
const { createSchema, createYoga, createPubSub } = require("graphql-yoga");
const pubSub = createPubSub();
const prisma = new PrismaClient();

const Comment = require("./resolvers/Comment");
const User = require("./resolvers/User");
const Post = require("./resolvers/Post");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");

const db = require("./db");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf-8"
);

const schema = createSchema({
  typeDefs,
  resolvers: {
    Comment,
    Post,
    User,
    Query,
    Mutation,
    Subscription,
  },
});

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
  context: { db, pubSub, prisma },
  schema,
  maskedErrors: false,
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

// Start the server and you're done!
server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
