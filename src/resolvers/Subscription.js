const { setTimeout } = require("node:timers/promises");

const Subscription = {
  countdown: {
    // This will return the value on every 1 sec until it reaches 0
    subscribe: async function* (_, args) {
      for (let i = args.from; i >= 0; i--) {
        await setTimeout(1000);
        console.log(args);
        yield { countdown: i };
      }
    },
  },
  comment: {
    subscribe(parent, { postId }, { pubSub }) {
      return pubSub.subscribe(`comment ${postId}`);
    },
  },
};

module.exports = Subscription;
