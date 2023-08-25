// import Posts from '../Posts';
import Header from '../Header';
import SignUp from '../Modal/SignUp';
// import EditProfile from '../Modal/EditProfile';
// import SignIn from '../Modal/SignIn';

import './App.css';

function App() {
  return (
    <div className="app">
      <Header className="app__header" />
      <SignUp className="app__modal" />
    </div>
  );
}

export default App;
