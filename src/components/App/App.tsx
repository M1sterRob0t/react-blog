import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Header from '../Header';
import Posts from '../Posts';
import './App.css';
import { AppRoute } from '../../constants';
import NotFound from '../NotFound';
import PostFull from '../PostFull';
import SignUp from '../Modal/SignUp';
import SignIn from '../Modal/SignIn';
import EditProfile from '../Modal/EditProfile';
import CreateNewPost from '../CreateNewPost';

function App() {
  return (
    <div className="app">
      <Header className="app__header" />
      <Routes>
        <Route path={AppRoute.Root} element={<Posts />} />
        <Route path={AppRoute.Articles} element={<Posts />} />
        <Route path={AppRoute.NotFound} element={<NotFound />} />
        <Route path={AppRoute.Article} element={<PostFull />} />
        <Route path={AppRoute.Registration} element={<SignUp className="app__modal" />} />
        <Route path={AppRoute.Login} element={<SignIn className="app__modal" />} />
        <Route path={AppRoute.Profile} element={<EditProfile className="app__modal" />} />
        <Route path={AppRoute.NewArticle} element={<CreateNewPost className="app__create-new-post" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
