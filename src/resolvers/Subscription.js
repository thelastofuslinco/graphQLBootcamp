const { setTimeout } = require("node:timers/promises");

const Subscription = {
  countdown: {
    // This will return the value on every 1 sec until it reaches 0
    subscribe: async function* (_, args) {
      for (let i = args.from; i >= 0; i--) {
        await setTimeout(1000);
        yield { countdown: i };
      }
    },
  },
  comment: {
    subscribe: async (parent, args, { prisma, pubSub }) => {
      const postExists = await prisma.post.findUnique({
        where: { id: parseInt(args.postId) },
      });

      if (!postExists) {
        throw new Error(`Post ${id} does not exist.`);
      }

      return pubSub.subscribe(`comment ${postIndex}`);
    },
  },
  post: {
    subscribe(parent, args, { pubSub }) {
      return pubSub.subscribe("post");
    },
  },
};

module.exports = Subscription;
