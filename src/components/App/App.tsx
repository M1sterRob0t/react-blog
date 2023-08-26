import Posts from '../Posts';
// import Post from '../Post';
// import CreateNewPost from '../CreateNewPost';
import Header from '../Header';
// import SignUp from '../Modal/SignUp';
// import EditProfile from '../Modal/EditProfile';
// import SignIn from '../Modal/SignIn';

import './App.css';

const articles = [
  {
    id: '1',
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'It takes a Jacobian',
    tags: ['dragons', 'training'],
    createdAt: '2021-02-18T03:22:56.637Z',
    updatedAt: '2021-02-18T03:48:35.824Z',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'jake',
      bio: 'I work at State Farm.',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
  },
  {
    id: '2',
    slug: 'how-to-train-your-dragon-2',
    title: 'How to train your dragon 2',
    description: 'So toothless',
    body: 'It is a dragon',
    tags: ['dragons', 'training'],
    createdAt: '2021-02-18T03:22:56.637Z',
    updatedAt: '2021-02-18T03:48:35.824Z',
    favorited: true,
    favoritesCount: 12,
    author: {
      username: 'jake',
      bio: 'I work at State Farm.',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
  },
];

function App() {
  return (
    <div className="app">
      <Header className="app__header" isUserAuthorized={false} />
      <Posts articles={articles} />
    </div>
  );
}

export default App;
