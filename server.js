const { createSchema, createYoga } = require('graphql-yoga')
const { createServer } = require('node:http')
const { resolvers } = require('./resolvers')
const { typeDefs } = require('./typeDefs')

const schema = createSchema({
  typeDefs,
  resolvers
})

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema })

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
