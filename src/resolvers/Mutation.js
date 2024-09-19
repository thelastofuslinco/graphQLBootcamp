const uuid = require("uuid");

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTest = db.users.some((user) => user.email === args.data.email);

    if (emailTest) {
      throw new Error("Email aready exists.");
    }

    const user = { ...args.data, id: uuid.v4() };
    db.users.push(user);
    return user;
  },
  createPost(parent, args, { db }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      throw new Error(`User ${args.data.author} does not exists.`);
    }

    const newPost = { ...args.data, id: uuid.v4() };

    db.posts.push(newPost);
    return newPost;
  },
  createComment(parent, args, { db, pubSub }) {
    const userExist = db.users.some((user) => user.id === args.data.author);

    if (!userExist) {
      throw new Error(`User ${args.data.author} not exists.`);
    }

    const postExists = db.posts.some((post) => post.id === args.data.post);

    if (!postExists) {
      throw new Error(`Post ${args.data.post} does not exists.`);
    }

    const newComment = { ...args.data, id: uuid.v4() };

    db.comments.push(newComment);

    pubSub.publish(`comment ${args.data.post}`, {
      comment: newComment,
    });
    return newComment;
  },
  deleteUser(parent, args, { db }) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });

    if (userIndex === -1) {
      throw new Error(`User ${args.id} does not exists.`);
    }

    for (let i = db.comments.length - 1; i >= 0; i--) {
      if (comments[i].author === args.id) {
        db.comments.splice(i, 1);
      }
    }

    for (let i = db.posts.length - 1; i >= 0; i--) {
      if (posts[i].author === args.id) {
        db.posts.splice(i, 1);
      }
    }

    db.users.splice(userIndex, 1);

    return db.users[userIndex];
  },
  deletePost(parent, args, { db }) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error(`Post ${args.id} does not exists.`);
    }

    for (let i = db.comments.length - 1; i >= 0; i--) {
      if (comments[i].post === args.id) {
        db.comments.splice(i, 1);
      }
    }

    db.posts.splice(postIndex, 1);

    return db.posts[postIndex];
  },
  deleteComment(parent, args, { db }) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error(`Comment ${args.id} does not exists.`);
    }

    db.comments.splice(commentIndex, 1);

    return db.comments[commentIndex];
  },
  updateUser(parent, args, { db }) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });

    if (userIndex === -1) {
      throw new Error(`User ${args.id} does not exists.`);
    }

    const emailTest = db.users.some((user) => user.email === args.data.email);

    if (emailTest) {
      throw new Error("Email aready exists.");
    }

    const updates = ["email", "name", "age"];

    updates.forEach((field) => {
      if (typeof args.data[field] !== "undefined") {
        db.users[userIndex][field] = args.data[field];
      }
    });

    return db.users[userIndex];
  },
  updatePost(parent, args, { db }) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error(`Post ${args.id} does not exists.`);
    }

    const updates = ["title", "body", "published"];

    updates.forEach((field) => {
      if (typeof args.data[field] !== "undefined") {
        db.posts[postIndex][field] = args.data[field];
      }
    });

    return db.posts[postIndex];
  },
  updateComment(parent, args, { db }) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error(`Comment ${args.id} does not exists.`);
    }

    const updates = ["text"];

    updates.forEach((field) => {
      if (typeof args.data[field] !== "undefined") {
        db.comments[commentIndex][field] = args.data[field];
      }
    });

    return db.comments[commentIndex];
  },
};

module.exports = Mutation;
