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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
