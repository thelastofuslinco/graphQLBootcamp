const Mutation = {
  createUser: async (parent, args, { prisma }) => {
    try {
      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      if (!isValidEmail(args.data.email)) {
        throw new Error(
          "O e-mail fornecido é inválido. Por favor, forneça um e-mail válido."
        );
      }

      return await prisma.user.create({
        data: {
          ...args.data,
        },
      });
    } catch (error) {
      // Verifica se o erro é relacionado à restrição de unicidade
      if (
        error.code === "P2002" &&
        error.meta &&
        error.meta.target.includes("email")
      ) {
        throw new Error(
          "Esse e-mail já está em uso. Por favor, utilize outro e-mail."
        );
      }

      // Caso contrário, lança o erro original
      throw new Error(error.message);
    }
  },
  createPost: async (parent, args, { prisma, pubSub }) => {
    const userExist = await prisma.user.findUnique({
      where: { id: parseInt(args.data.author) },
    });

    if (!userExist) {
      throw new Error(`User ${args.data.author} does not exist.`);
    }

    const newPost = await prisma.post.create({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: { id: parseInt(args.data.author) },
        },
      },
    });

    if (newPost.published) {
      pubSub.publish("post", {
        post: {
          mutation: "CREATED",
          data: newPost,
        },
      });
    }

    return newPost;
  },
  createComment: async (parent, args, { prisma, pubSub }) => {
    const userExist = await prisma.user.findUnique({
      where: { id: parseInt(args.data.author) },
    });

    if (!userExist) {
      throw new Error(`User ${args.data.author} does not exist.`);
    }

    const postExists = await prisma.post.findUnique({
      where: { id: parseInt(args.data.post) },
    });

    if (!postExists) {
      throw new Error(`Post ${args.data.post} does not exists.`);
    }

    const newComment = await prisma.comment.create({
      data: {
        text: args.data.text,
        author: {
          connect: { id: parseInt(args.data.author) },
        },
        post: {
          connect: { id: parseInt(args.data.post) },
        },
      },
    });

    pubSub.publish(`comment ${args.data.post}`, {
      comment: { mutation: "CREATED", data: newComment },
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

    const removedUser = db.users[userIndex];

    db.users.splice(userIndex, 1);

    return removedUser;
  },
  deletePost(parent, args, { db, pubSub }) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error(`Post ${args.id} does not exists.`);
    }

    for (let i = db.comments.length - 1; i >= 0; i--) {
      if (db.comments[i].post === args.id) {
        db.comments.splice(i, 1);
      }
    }

    const removedPost = db.posts[postIndex];

    db.posts.splice(postIndex, 1);

    if (removedPost.published) {
      pubSub.publish("post", {
        post: { mutation: "DELETED", data: removedPost },
      });
    }

    return removedPost;
  },
  deleteComment(parent, args, { db, pubSub }) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error(`Comment ${args.id} does not exists.`);
    }

    const removedComment = db.comments[commentIndex];

    db.comments.splice(commentIndex, 1);

    pubSub.publish(`comment ${removedComment.post}`, {
      comment: { mutation: "DELETED", data: removedComment },
    });

    return removedComment;
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
  updatePost(parent, args, { db, pubSub }) {
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

    pubSub.publish("post", {
      post: {
        mutation: "UPDATED",
        data: db.posts[postIndex],
      },
    });

    return db.posts[postIndex];
  },
  updateComment(parent, args, { db, pubSub }) {
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

    pubSub.publish(`comment ${db.comments[commentIndex].post}`, {
      comment: {
        mutation: "UPDATED",
        data: db.comments[commentIndex],
      },
    });

    return db.comments[commentIndex];
  },
};

module.exports = Mutation;
