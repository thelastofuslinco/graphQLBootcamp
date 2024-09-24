const Comment = {
  author: async ({ authorId }, args, { prisma }) => {
    return await prisma.user.findUnique({
      where: { id: parseInt(authorId) },
    });
  },
  post: async ({ postId }, args, { prisma }) => {
    return await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });
  },
};

module.exports = Comment;
