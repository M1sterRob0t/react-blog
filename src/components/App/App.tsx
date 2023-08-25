import Posts from '../Posts';
import Header from '../Header';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header className="app__header" />
      <Posts />
    </div>
  );
}

export default App;
