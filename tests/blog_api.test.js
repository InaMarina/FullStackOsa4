const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { response } = require("express");
const Blog = require("../models/blog");

const api = supertest(app);

const initBlogs = [
  {
    title: "First blog",
    author: "First writer",
    url: "www.1.fi",
    likes: 2,
  },
  {
    title: "Second blog",
    author: "Second writer",
    url: "www.2.fi",
    likes: 8,
  },
  {
    title: "Third blog",
    author: "Third writer",
    url: "www.3.fi",
    likes: 1,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initBlogs[1]);
  await blogObject.save();

  blogObject = new Blog(initBlogs[2]);
  await blogObject.save();
});

test("blogs are returned as json and right amount of blogs are returned", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toHaveLength(initBlogs.length);
});

test("blogs have id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("blogs can be added", async () => {
  const newBlog = {
    title: "New blog",
    author: "New writer",
    url: "www.new.fi",
    likes: 1,
  };

  await api.post("/api/blogs").send(newBlog).expect(200);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initBlogs.length + 1);

  const objects = response.body.map((obj) => obj.title);
  expect(objects).toContain("New blog");
});

test("if likes are not given then likes=0", async () => {
  const newBlog = {
    title: "New blog",
    author: "New writer",
    url: "www.new.fi",
  };
  await api.post("/api/blogs").send(newBlog).expect(200);
  const response = await api.get("/api/blogs");
  const objects = response.body.map((obj) => obj.likes);
  expect(objects).toContain(0);
});
//4.12
test("if no url or title response is bad request", async () => {
  const newBlog = {
    author: "New writer",
  };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
