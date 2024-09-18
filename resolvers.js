const uuid = require("uuid");

const users = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  name: `User ${index}`,
  email: `User${index}@mail.com`,
  age: 24 + index,
}));

const posts = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  title: `Title ${index}`,
  body: `Body ${index}`,
  published: false,
  author: index.toString(),
}));

const comments = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  text: `Comment ${index}`,
  author: index.toString(),
  post: index.toString(),
}));

const resolvers = {
  Query: {
    me() {
      return {
        id: "1234",
        name: "Lincoln",
        email: "Lincoln@mail.com",
        age: 24,
      };
    },
    posts(parent, { query }) {
      return posts.filter((post) =>
        post.title.toLowerCase().includes(query?.toLowerCase() || "")
      );
    },
    users(parent, { query }) {
      return users.filter((user) =>
        user.name.toLowerCase().includes(query?.toLowerCase() || "")
      );
    },
    comments(parent, { query }) {
      return comments.filter((comment) =>
        comment.text.toLowerCase().includes(query?.toLowerCase() || "")
      );
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTest = users.some((user) => user.email === args.data.email);

      if (emailTest) {
        throw new Error("Email aready exists.");
      }

      const user = { ...args.data, id: uuid.v4() };
      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.data.author);

      if (!userExist) {
        throw new Error(`User ${args.data.author} not exists.`);
      }

      const newPost = { ...args.data, id: uuid.v4() };

      posts.push(newPost);
      return newPost;
    },
    createComment(parent, args) {
      const userExist = users.some((user) => user.id === args.data.author);

      if (!userExist) {
        throw new Error(`User ${args.data.author} not exists.`);
      }

      const postExists = posts.some((post) => post.id === args.data.post);

      if (!postExists) {
        throw new Error(`Post ${args.data.post} not exists.`);
      }

      const newComment = { ...args.data, id: uuid.v4() };

      comments.push(newComment);
      return newComment;
    },
    deleteUser(parent, args) {
      const userIndex = users.findIndex((user) => {
        return user.id === args.author;
      });

      if (userIndex === -1) {
        throw new Error(`User ${args.author} not exists.`);
      }

      for (let i = comments.length - 1; i >= 0; i--) {
        if (comments[i].author === args.author) {
          comments.splice(i, 1);
        }
      }

      for (let i = posts.length - 1; i >= 0; i--) {
        if (posts[i].author === args.author) {
          posts.splice(i, 1);
        }
      }

      users.splice(userIndex, 1);
      console.log(users);

      return `User ${args.author} and associated posts and comments have been deleted.`;
    },
  },
  Post: {
    author(parent) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author(parent) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent) {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

module.exports = { resolvers };
