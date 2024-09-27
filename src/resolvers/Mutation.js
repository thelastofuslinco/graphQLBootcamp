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
  deleteUser: async (parent, args, { prisma }) => {
    const { id } = args;

    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userExists) {
      throw new Error(`User with ID ${id} does not exist.`);
    }

    await prisma.comment.deleteMany({
      where: { authorId: parseInt(id) },
    });

    await prisma.post.deleteMany({
      where: { authorId: parseInt(id) },
    });

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return userExists;
  },
  deletePost: async (parent, args, { prisma, pubSub }) => {
    const { id } = args;

    const postExists = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!postExists) {
      throw new Error(`Post ${id} does not exists.`);
    }

    await prisma.comment.deleteMany({
      where: { postId: parseInt(id) },
    });

    const removedPost = await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    if (removedPost.published) {
      pubSub.publish("post", {
        post: { mutation: "DELETED", data: removedPost },
      });
    }

    return removedPost;
  },
  deleteComment: async (parent, args, { prisma, pubSub }) => {
    const { id } = args;

    const commentExists = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!commentExists) {
      throw new Error(`Comment ${args.id} does not exists.`);
    }

    const removedComment = await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    pubSub.publish(`comment ${removedComment.post}`, {
      comment: { mutation: "DELETED", data: removedComment },
    });

    return removedComment;
  },
  updateUser: async (parent, args, { prisma }) => {
    const { id, data } = args;

    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userExists) {
      throw new Error(`User ${id} does not exist.`);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        email: data.email,
        age: data.age,
        role: data.role,
      },
    });

    return updatedUser;
  },
  updatePost: async (parent, args, { prisma, pubSub }) => {
    const { id, data } = args;

    const postExists = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!postExists) {
      throw new Error(`Post ${id} does not exist.`);
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        body: data.body,
        published: data.published,
      },
    });

    pubSub.publish("post", {
      post: {
        mutation: "UPDATED",
        data: updatedPost,
      },
    });

    return updatedPost;
  },
  updateComment: async (parent, args, { prisma, pubSub }) => {
    const { id, data } = args;

    const commentExists = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!commentExists) {
      throw new Error(`Comment ${id} does not exist.`);
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: {
        text: data.text,
      },
    });

    pubSub.publish("post", {
      post: {
        mutation: "UPDATED",
        data: updatedComment,
      },
    });

    return updatedComment;
  },
};

module.exports = Mutation;
