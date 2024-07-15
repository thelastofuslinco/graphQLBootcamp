const typeDefs = `
    type Query {
        me: User!
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        comments(query: String): [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
`
module.exports = { typeDefs }
