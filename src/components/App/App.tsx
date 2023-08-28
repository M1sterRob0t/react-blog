import { Route, Routes } from 'react-router-dom';

import Header from '../Header';
import Posts from '../Posts';
import './App.css';
import { APIRoute } from '../../constants';
import PostFull from '../PostFull';

// import CreateNewPost from '../CreateNewPost';
// import SignUp from '../Modal/SignUp';
// import EditProfile from '../Modal/EditProfile';
// import SignIn from '../Modal/SignIn';

function App() {
  return (
    <div className="app">
      <Header className="app__header" isUserAuthorized={false} />
      <Routes>
        <Route path={APIRoute.Root} element={<Posts />} />
        <Route path={APIRoute.Articles} element={<Posts />} />
        <Route path={APIRoute.Article} element={<PostFull />} />
      </Routes>
    </div>
  );
}

export default App;
