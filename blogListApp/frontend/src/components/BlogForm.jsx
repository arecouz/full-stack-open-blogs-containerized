import { useState } from 'react';

const BlogForm = ({ handleAddNewBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    handleAddNewBlog({
      title: title,
      author: author,
      url: url,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <div className="form-field">
        <label>New Blog</label>
        <input
          type="text"
          value={title}
          name="title"
          placeholder='title'
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="form-field">
        <label>Author</label>
        <input
          type="text"
          value={author}
          name="author"
          placeholder='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div className="form-field">
        <label>url</label>
        <input
          type="text"
          value={url}
          name="url"
          placeholder='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button>post</button>
    </form>
  );
};

export default BlogForm;
