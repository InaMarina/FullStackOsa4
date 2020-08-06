const User = require("../models/user");

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

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  usersInDb,
};
