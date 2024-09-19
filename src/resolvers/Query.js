const Query = {
  me() {
    return {
      id: "1234",
      name: "Lincoln",
      email: "Lincoln@mail.com",
      age: 24,
    };
  },
  posts(parent, { query }, { db }) {
    return db.posts.filter((post) =>
      post.title.toLowerCase().includes(query?.toLowerCase() || "")
    );
  },
  users(parent, { query }, { db }) {
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(query?.toLowerCase() || "")
    );
  },
  comments(parent, { query }, { db }) {
    return db.comments.filter((comment) =>
      comment.text.toLowerCase().includes(query?.toLowerCase() || "")
    );
  },
};

module.exports = Query;
