import { useEffect } from 'react';

import Header from '../Header';
import Posts from '../Posts';
import { fetchArticles } from '../../state/api-actions';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import './App.css';

// import Post from '../Post';
// import CreateNewPost from '../CreateNewPost';
// import SignUp from '../Modal/SignUp';
// import EditProfile from '../Modal/EditProfile';
// import SignIn from '../Modal/SignIn';

function App() {
  const articles = useAppSelector((state) => state.blog.articles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles(1));
  }, []);

  return (
    <div className="app">
      <Header className="app__header" isUserAuthorized={false} />
      <Posts articles={articles} />
    </div>
  );
}

export default App;
