import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LoginButton from './components/LoginButton';
import loginService from './services/login';
import LogoutButton from './components/LogoutButton';
import BlogForm from './components/BlogForm';
import BlogsList from './components/BlogsList';
import Toggleable from './components/Toggleable';

const App = () => {
  const baseUrl = '/api/blogs';
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const noteFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }

    axios.get(baseUrl).then((response) => {
      setBlogs(response.data);
    });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('trying: logging in with', username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedAppUser', JSON.stringify(user));

      setUser(user);
      setNotification({ type: 'success', message: `Hi, ${user.username}!` });
    } catch {
      if ((username === '') | (password === '')) {
        doNotification('error', 'enter username and password');
      }
      doNotification('error', 'username or password not found');
      setUsername('');
      setPassword('');
    }
  };

  const doNotification = (type, message) => {
    setNotification({ type: type, message: message });
    setTimeout(() => {
      setNotification({ type: 'hidden', message: 'hidden' });
    }, 2500);
  };

  const addBlog = async (blogObject) => {
    noteFormRef.current.switchToggle();
    try {
      const response = await axios.post(baseUrl, blogObject, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBlogs([...blogs, response.data]);
      doNotification('success', `'${blogObject.title}' added!`);
    } catch (error) {
      doNotification('error', 'Post failed, try again');
      console.log(error);
    }
  };

  const deleteBlog = async (blogID) => {
    const blogToDelete = blogs.find((blog) => blog.id === blogID);
    console.log('delete? : ', blogToDelete);
    if (
      window.confirm(`are you sure you want to delete '${blogToDelete.title}'?`)
    )
      try {
        const response = await axios.delete(`${baseUrl}/${blogID}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const updatedBlogs = blogs.filter((blog) => blog.id !== blogID);
        setBlogs(updatedBlogs);
        doNotification('success', `${blogToDelete.title} successfully deleted`);
      } catch (error) {
        doNotification('error', 'delete failed, try again');
        console.log(error);
      }
  };

  const incrementLikes = async (blogID) => {
    const blogToUpdate = blogs.find((blog) => blog.id === blogID);
    console.log('increasing likes: ', blogToUpdate);
    const response = await axios.put(`${baseUrl}/${blogID}`, {
      likes: blogToUpdate.likes + 1,
    });
    const updatedBlogs = blogs.map((blog) =>
      blog.id === blogID ? { ...blog, likes: blog.likes + 1 } : blog
    );
    setBlogs(updatedBlogs);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin} className="login-form">
      <div className="form-field">
        <label>Username</label>
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
          autoComplete="username"
        />
      </div>
      <div className="form-field">
        <label>Password</label>
        <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
          autoComplete="current-password"
        />
      </div>
      <LoginButton />
    </form>
  );

  if (user === null) {
    return (
      <div>
        <h1>Blogs List</h1>
        <p className={`notification ${notification.type}`}>
          {notification.message}
        </p>
        {loginForm()}
      </div>
    );
  }

  console.log('username: ', username);
  return (
    <>
      <h1> Blogs List</h1>
      <div className="user-info">
        <h2>{user.username}</h2>
        <LogoutButton
          setUser={setUser}
          doNotification={doNotification}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
      <p className={`notification ${notification.type}`}>
        {notification.message}
      </p>
      <Toggleable buttonLabel={'Add  blog'} ref={noteFormRef}>
        <BlogForm handleAddNewBlog={addBlog}></BlogForm>
      </Toggleable>
      <br></br>
      <BlogsList
        blogs={blogs}
        incrementLikes={incrementLikes}
        handleBlogDelete={deleteBlog}
        user={user}
      ></BlogsList>
    </>
  );
};

export default App;
