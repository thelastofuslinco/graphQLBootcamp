const Post = {
  author: async ({ authorId }, args, { prisma }) => {
    return await prisma.user.findUnique({
      where: { id: parseInt(authorId) },
    });
  },
  comments: async ({ id }, args, { prisma }) => {
    return await prisma.comment.findMany({
      where: {
        postId: id,
      },
    });
  },
};

module.exports = Post;
