const users = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  name: `User ${index}`,
  email: `User${index}@mail.com`,
  age: 24 + index
}))

const posts = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  title: `Title ${index}`,
  body: `Body ${index}`,
  published: false,
  author: index
}))

const comments = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  text: `Comment ${index}`,
  author: index,
  post: index
}))

comments.push({
  id: 11,
  text: `Comment ${11}`,
  author: 2,
  post: 0
})

const resolvers = {
  Query: {
    me() {
      return {
        id: '1234',
        name: 'Lincoln',
        email: 'Lincoln@mail.com',
        age: 24
      }
    },
    posts(parent, { query }) {
      return posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      )
    },
    users(parent, { query }) {
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      )
    },
    comments(parent, { query }) {
      return comments.filter((comment) =>
        comment.text.toLowerCase().includes(query.toLowerCase())
      )
    }
  },
  Post: {
    author(parent, args) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  User: {
    posts(parent) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent) {
      return comments.filter((comment) => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent) {
      return posts.find((post) => post.id === parent.id)
    }
  }
}

module.exports = { resolvers }
