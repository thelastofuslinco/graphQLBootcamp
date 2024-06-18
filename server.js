const { createSchema, createYoga } = require('graphql-yoga')
const { createServer } = require('node:http')

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      me: User!
      posts: [Post!]
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
    }
  `,
  resolvers: {
    Query: {
      me() {
        return {
          id: '1234',
          name: 'Lincoln',
          email: 'Lincoln@mail.com',
          age: 24
        }
      },
      posts() {
        return [{ id: '123', title: 'Title from post' }]
      }
    }
  }
})

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema })

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
