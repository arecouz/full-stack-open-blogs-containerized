import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogList from './BlogsList';
import { beforeEach, expect } from 'vitest';

const user = { username: 'a username' };
const blogs = [
  {
    id: 1,
    title: 'a title',
    author: 'an author',
    url: 'url',
    likes: 0,
    user: user,
  },
];

test('renders just title and author by default', () => {
  render(
    <BlogList
      blogs={blogs}
      incrementLikes={vi.fn()}
      handleBlogDelete={vi.fn()}
      user={user}
    />
  );
  const element = screen.getByText(blogs[0].title).textContent;
  expect(element).toBeDefined();
});

test('renders additional url and likes when view button pressed ', async () => {
  render(
    <BlogList
      blogs={blogs}
      incrementLikes={vi.fn()}
      handleBlogDelete={vi.fn()}
      user={user}
    />
  );
  const testUser = userEvent.setup();
  const button = screen.getByText('view');
  await testUser.click(button);

  const likes = screen.getByText(`likes: ${blogs[0].likes}`);
  const url = screen.getByText(blogs[0].url);
  expect(likes).toBeDefined();
  expect(url).toBeDefined();
});

test('likes button event handler activated on click', async () => {
  const mockHandler = vi.fn();

  render(
    <BlogList
      blogs={blogs}
      incrementLikes={mockHandler}
      handleBlogDelete={vi.fn}
      user={user}
    />
  );
  const testUser = userEvent.setup();
  const viewButton = screen.getByText('view');
  await testUser.click(viewButton);
  const likeButton = screen.getByText('+1');
  await testUser.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
