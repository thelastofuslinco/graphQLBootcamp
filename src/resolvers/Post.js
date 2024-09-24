const Post = {
  author: ({ authorId }, args, { prisma }) => {
    return prisma.user.findUnique({
      where: { id: parseInt(authorId) },
    });
  },
  comments: async (parent, args, { prisma }) => {
    return await prisma.comment.findMany({
      where: {
        postId: parent.id,
      },
    });
  },
};

module.exports = Post;
