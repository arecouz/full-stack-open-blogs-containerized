const _ = require('lodash');

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
    likes: 18,
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

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  fave = blogs.reduce((winning, current) => {
    return current.likes > winning.likes ? current : winning;
  }, blogs[0]);
  return fave;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authorCounts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(
    _.keys(authorCounts),
    (author) => authorCounts[author]
  );
  return { author: topAuthor, blogs: authorCounts[topAuthor] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const authorLikes = {};
  blogs.forEach((blog) => {
    if (authorLikes.hasOwnProperty(blog.author)) {
      authorLikes[blog.author] += blog.likes;
    } else {
      authorLikes[blog.author] = blog.likes;
    }
  });

  topAuthor = _.maxBy(_.keys(authorLikes), (author) => authorLikes[author]);

  return { author: topAuthor, likes: authorLikes[topAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
