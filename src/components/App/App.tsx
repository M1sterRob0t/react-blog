import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from '../Header';
import Posts from '../Posts';
import { fetchArticles } from '../../state/api-actions';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import './App.css';
import { APIRoute } from '../../constants';
import PostFull from '../PostFull';

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
      <Routes>
        <Route path={APIRoute.Root} element={<Posts articles={articles} />} />
        <Route path={APIRoute.Articles} element={<Posts articles={articles} />} />
        <Route path={APIRoute.Article} element={<PostFull />} />
      </Routes>
    </div>
  );
}

export default App;
