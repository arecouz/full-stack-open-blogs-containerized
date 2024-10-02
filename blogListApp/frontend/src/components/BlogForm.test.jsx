import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import { assert, beforeEach, expect } from 'vitest';


test('blog form calls event handler with correct props', async () => {
    const addBlog = vi.fn()
    render(<BlogForm handleAddNewBlog={addBlog}></BlogForm>)

    const user = userEvent.setup()

    const titleInput = screen.getByPlaceholderText('title')
    await user.type(titleInput, "TEST TITLE")

    const authorInput = screen.getByPlaceholderText('author')
    await user.type(authorInput, "TEST AUTHOR")

    const urlInput = screen.getByPlaceholderText('url')
    await user.type(urlInput, "TEST URL")

    const postButton = screen.getByText('post')
    await user.click(postButton)

    const callArgs = addBlog.mock.calls[0][0]

    expect(callArgs.title).toBe("TEST TITLE")
    expect(callArgs.author).toBe("TEST AUTHOR")
    expect(callArgs.url).toBe("TEST URL")
    
});