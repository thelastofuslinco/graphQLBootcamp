const User = {
  posts: async ({ id }, args, { prisma }) => {
    return prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
  },
  comments: async ({ id }, args, { prisma }) => {
    return await prisma.comment.findMany({
      where: { id: parseInt(id) },
    });
  },
};

module.exports = User;
