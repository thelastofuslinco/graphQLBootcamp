const User = {
  posts: async ({ id }, args, { prisma }) => {
    return await prisma.post.findMany({
      where: { authorId: parseInt(id) },
    });
  },
  comments: async ({ id }, args, { prisma }) => {
    return await prisma.comment.findMany({
      where: { authorId: parseInt(id) },
    });
  },
};

module.exports = User;
