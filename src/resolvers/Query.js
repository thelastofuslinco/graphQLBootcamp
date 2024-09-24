const Query = {
  me() {
    return {
      id: "1234",
      name: "Lincoln",
      email: "Lincoln@mail.com",
      age: 24,
    };
  },
  posts: async (parent, { query }, { prisma }) => {
    return await prisma.post.findMany({
      where: {
        title: {
          contains: query || "",
        },
      },
    });
  },

  users: async (parent, { query }, { prisma }) => {
    return await prisma.user.findMany({
      where: {
        name: {
          contains: query || "",
        },
      },
    });
  },

  comments: async (parent, { query }, { prisma }) => {
    return await prisma.comment.findMany({
      where: {
        text: {
          contains: query || "",
        },
      },
    });
  },
};

module.exports = Query;
