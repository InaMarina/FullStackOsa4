const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
  //Blog.find({}).then((blogs) => {
  //  response.json(blogs);
  //});
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  // const token = getTokenFrom(request);
  const token = request.token;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete(":/id", async (request, response) => {
  const token = request.token;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(401)
      .json({ error: "blogs can be deleted only by the creator" });
  }

  await blog.remove();
  user.blogs = user.blogs.filter(
    (b) => b.id.toString() !== request.params.id.toString()
  );
  await user.save();
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.status(200).end();
  } catch (exception) {
    next(exception);
  }
  //Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  //  .then((updatedNote) => {
  //    response.json(updatedNote.toJSON);
  //  })
  //  .catch((error) => next(error));
});

module.exports = blogsRouter;
