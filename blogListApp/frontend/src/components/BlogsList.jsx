import Toggleable from './Toggleable';

const BlogsList = ({ blogs, incrementLikes, handleBlogDelete, user }) => {
  const blogStyle = {
    padding: '5px 5px',
    backgroundColor: 'black',
    borderRadius: '8px',
    border: '1px solid',
  };

  const buttonStyle = {
    width: '40px',
    borderRadius: '8px',
    fontSize: '0.55em',
    fontWeight: '500',
    fontFamily: 'inherit',
    backgroundColor: 'green',
    cursor: 'pointer',
    transition: 'border-color 0.25s',
    marginLeft: '15px',
  };

  const tittleStyle = {
    border: '1px solid transparent',
    color: '#fcba03',
    padding: '0.6em 0.8em',
    fontWeight: '80',
    fontFamily: "'Courier New', monospace",
    fontSize: '1.3em',
    fontWeight: 'bold',
  };

  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes);
  return (
    <ul className="blogsList">
      {sortedBlogs.map((blog) => (
        <li key={blog.id} style={blogStyle}>
          <h3 style={tittleStyle} data-testid='blogTitle'>
            {blog.title}
            <Toggleable buttonLabel={'view'}>
              <a href={blog.url} target="_blank" rel="noopener noreferrer">
                {blog.url}
              </a>
              <p>by {blog.author}</p>
              <p>
                likes: {blog.likes}
                <button
                  style={buttonStyle}
                  onClick={() => incrementLikes(blog.id)}
                >
                  +1
                </button>
              </p>

              <p style={{ fontSize: '18px' }}>
                created by user: {blog.user.username}
              </p>

              {user.username === blog.user.username ? (
                <button
                  style={{ color: 'white', background: 'red' }}
                  onClick={() => handleBlogDelete(blog.id)}
                >
                  delete
                </button>
              ) : null}
              <br></br>
            </Toggleable>
          </h3>
        </li>
      ))}
    </ul>
  );
};
export default BlogsList;
