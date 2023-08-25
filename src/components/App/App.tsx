// import Posts from '../Posts';
import CreateNewPost from '../CreateNewPost';
import Header from '../Header';
// import SignUp from '../Modal/SignUp';
// import EditProfile from '../Modal/EditProfile';
// import SignIn from '../Modal/SignIn';

import './App.css';

function App() {
  return (
    <div className="app">
      <Header className="app__header" />
      <CreateNewPost className="app__create-new-post" />
    </div>
  );
}

export default App;
