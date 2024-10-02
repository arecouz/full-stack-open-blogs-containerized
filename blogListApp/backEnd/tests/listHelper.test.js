const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

console.log("environment: ", process.env.NODE_ENV)
console.log("uri: ", process.env.MONGODB_URI)

oneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];
threeBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'The Mythical Man-Month',
    author: 'Fred Brooks',
    url: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17fa',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    likes: 8,
    __v: 0,
  },
];
threeBlogsWithLikesTie = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'The Mythical Man-Month',
    author: 'Fred Brooks',
    url: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17fa',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    likes: 8,
    __v: 0,
  },
];
threeBlogsWithDuplicateAuthor = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'JOHN',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'The Mythical Man-Month',
    author: 'Fred Brooks',
    url: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17fa',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'JOHN',
    url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    likes: 8,
    __v: 0,
  },
];

describe('describe test', () => {
  test('test test', () => {
    const blogs = [];
    const r = listHelper.dummy(blogs);
    assert.strictEqual(r, 1);
  });
});

describe('total likes', () => {
  test('for zero blogs', () => {
    const r = listHelper.totalLikes([]);
    assert.strictEqual(r, 0);
  });
  test('for one blog', () => {
    const r = listHelper.totalLikes(oneBlog);
    assert.strictEqual(r, 5);
  });
  test('for multiple blogs', () => {
    const r = listHelper.totalLikes(threeBlogs);
    assert.strictEqual(r, 23);
  });
});

describe('favorite blog', () => {
  test('for zero blogs', () => {
    const r = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(r, null);
  });
  test('for one blog', () => {
    const r = listHelper.favoriteBlog(oneBlog);
    assert.deepStrictEqual(r, {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    });
  });
  test('for multiple blogs', () => {
    const r = listHelper.favoriteBlog(threeBlogs);
    assert.deepStrictEqual(r, {
      _id: '5a422aa71b54a676234d17f9',
      title: 'The Mythical Man-Month',
      author: 'Fred Brooks',
      url: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
      likes: 10,
      __v: 0,
    });
  });
  test('for multiple blogs with a tie', () => {
    const r = listHelper.favoriteBlog(threeBlogsWithLikesTie);
    option1 = {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 10,
      __v: 0,
    };
    option2 = {
      _id: '5a422aa71b54a676234d17f9',
      title: 'The Mythical Man-Month',
      author: 'Fred Brooks',
      url: 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month',
      likes: 10,
      __v: 0,
    };
    assert.deepStrictEqual(r, option1 || option2);
  });
});

describe('most blogs', () => {
  test('for zero blogs', () => {
    const r = listHelper.mostBlogs([]);
    assert.deepStrictEqual(r, null);
  });
  test('for one blog', () => {
    const r = listHelper.mostBlogs(oneBlog);
    assert.deepStrictEqual(r, {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });
  test('for multiple blogs', () => {
    const r = listHelper.mostBlogs(threeBlogsWithDuplicateAuthor);
    assert.deepStrictEqual(r, {
      author: 'JOHN',
      blogs: 2,
    });
  });
});

describe('most likes', () => {
  test('for zero blogs', () => {
    const r = listHelper.mostLikes([]);
    assert.deepStrictEqual(r, null);
  });
  test('for one blog', () => {
    const r = listHelper.mostLikes(oneBlog);
    assert.deepStrictEqual(r, {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });
  test('for multiple blogs', () => {
    const r = listHelper.mostLikes(threeBlogsWithDuplicateAuthor);
    assert.deepStrictEqual(r, {
      author: 'JOHN',
      likes: 18,
    });
  });
});
