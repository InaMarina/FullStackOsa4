const User = require("../models/user");
const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce(function (previous, current) {
    return previous + current.likes;
  }, 0);
  return sum;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(
    (maxLikes, current) =>
      current.likes > maxLikes.likes ? current : maxLikes,
    blogs[0]
  );
  return favorite;
};

const mostBlogs = (blogs) => {
  let listWithMost = _.countBy(blogs, "author");
  //output: { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }
  let sortedlistNames = Object.keys(listWithMost).sort(function (a, b) {
    return listWithMost[a] - listWithMost[b];
  });
  let sortedlistBlogs = Object.keys(listWithMost)
    .sort(function (a, b) {
      return listWithMost[a] - listWithMost[b];
    })
    .map((key) => listWithMost[key]);

  return {
    author: _.last(sortedlistNames),
    blogs: _.last(sortedlistBlogs),
  };
};
const mostLikes = (blogs) => {
  let authors = _.map(blogs, "author");
  authors = _.uniq(authors);
  let authorsAndLikes = blogs.map((a) => {
    return { author: a.author, likes: a.likes };
  });
/*
  return {
    author: x,
    likess: _.last(sortedlistBlogs),
  };
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
}; */

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  usersInDb,
  mostBlogs,
  mostLikes,
};
