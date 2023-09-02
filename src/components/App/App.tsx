import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Header from '../Header';
import Posts from '../Posts';
import './App.css';
import { AppRoute } from '../../constants';
import NotFound from '../NotFound';

function App() {
  return (
    <div className="app">
      <Header className="app__header" />
      <Routes>
        <Route path={AppRoute.Root} element={<Posts />} />
        <Route path={AppRoute.Articles} element={<Posts />} />
        <Route path={AppRoute.NotFound} element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
