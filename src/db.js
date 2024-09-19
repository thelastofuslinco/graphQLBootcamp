const users = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  name: `User ${index}`,
  email: `User${index}@mail.com`,
  age: 24 + index,
}));

const posts = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  title: `Title ${index}`,
  body: `Body ${index}`,
  published: false,
  author: index.toString(),
}));

const comments = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  text: `Comment ${index}`,
  author: index.toString(),
  post: index.toString(),
}));

const db = {
  users,
  comments,
  posts,
};

module.exports = db;
