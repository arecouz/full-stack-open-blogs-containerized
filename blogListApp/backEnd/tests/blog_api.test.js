const { test, after, beforeEach, describe } = require('node:test');
const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const helper = require('./api_helper');
const bcrypt = require('bcrypt');

const api = supertest(app);

let token;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const newUser = {
    username: 'username',
    name: 'name',
    password: 'password',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const login = {
    username: newUser.username,
    password: newUser.password,
  };

  const loginResponse = await api
    .post('/api/login')
    .send(login)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  token = 'Bearer ' + loginResponse.body.token;
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('user can post blog when logged in', async () => {
  const newBlog = {
    title: 'a New Blog',
    author: 'a New Author',
    url: 'a New URL',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(201)
    .expect('Content-Type', /application\/json/);
});

test('user can NOT post blog without authorization token', async () => {
  const newBlog = {
    title: 'a New Blog',
    author: 'a New Author',
    url: 'a New URL',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

test('user can NOT post blog with wrong authorization token', async () => {
  const newBlog = {
    title: 'a New Blog',
    author: 'a New Author',
    url: 'a New URL',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token + 'x' })
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

test('when posting without likes field, default value 0 is used', async () => {
  const newBlog = {
    title: 'This Blog Has No Likes Field',
    author: 'a New Author',
    url: 'a New URL',
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDB();
  likes = blogsAtEnd[blogsAtEnd.length - 1].likes;
  assert.strictEqual(0, likes);
});

test('posting without title field responds with 404', async () => {
  const newBlog = {
    author: 'this blog has no title',
    url: 'a New URL',
    likes: 0,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test('deleting a blog removes it from DB, returns 204, with token', async () => {
  const newBlog = {
    title: 'a New Blog',
    author: 'a New Author',
    url: 'a New URL',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsInDb = await helper.blogsInDB();
  const blogToDelete = blogsInDb[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .send(newBlog)
    .set({ Authorization: token })
    .expect(204);

  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, blogsInDb.length - 1);

  const IDs = blogsAtEnd.map((blog) => blog.id);
  assert(!IDs.includes(blogToDelete.id));
});

test('attempting to delete a blog without token fails with 401', async () => {
  const newBlog = {
    title: 'a New Blog',
    author: 'a New Author',
    url: 'a New URL',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsInDb = await helper.blogsInDB();
  const blogToDelete = blogsInDb[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .send(newBlog)
    .set({ Authorization: token + 'g' })
    .expect(401);

  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, blogsInDb.length);

  const IDs = blogsAtEnd.map((blog) => blog.id);
  assert(IDs.includes(blogToDelete.id));
});

test('updating a blog post (likes) succeeds', async () => {
  const newBlog = {
    title: 'a New Blog',
    author: 'a New Author',
    url: 'a New URL',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsInDB = await helper.blogsInDB();
  const blogToUpdate = blogsInDB[0];

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: blogToUpdate.likes + 1 })
    .expect(201);

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});
