const Comment = {
  author: ({ authorId }, args, { prisma }) => {
    return prisma.user.findUnique({
      where: { id: parseInt(authorId) }, // Use a chave correta para buscar o autor
    });
  },
  post: ({ postId }, args, { prisma }) => {
    return prisma.post.findUnique({
      where: { id: parseInt(postId) }, // Use a chave correta para buscar o post
    });
  },
};

module.exports = Comment;
