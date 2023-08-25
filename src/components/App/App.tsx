// import Posts from '../Posts';
import Header from '../Header';
// import SignUp from '../SignUp';
import EditProfile from '../Modal/EditProfile';

import './App.css';

function App() {
  return (
    <div className="app">
      <Header className="app__header" />
      <EditProfile className="app__modal" />
    </div>
  );
}

export default App;
