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
    subscribe(parent, args, { db, pubSub }) {
      const postIndex = db.posts.findIndex((post) => {
        return post.id === args.postId;
      });

      if (postIndex === -1) {
        throw new Error(`Post ${args.postId} does not exists.`);
      }

      return pubSub.subscribe(`comment ${postIndex}`);
    },
  },
  post: {
    subscribe(parent, args, { db, pubSub }) {
      return pubSub.subscribe("post");
    },
  },
};

module.exports = Subscription;
