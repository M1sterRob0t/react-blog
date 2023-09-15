// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

import { server } from './mock/mockServiceWorker';
import { store } from './state/store';
import { removeUserAction } from './state/userReducer';

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

beforeAll(() => {
  // Запустите сервер msw перед началом всех тестов
  server.listen();
});

afterEach(() => {
  // Очистите все запросы между тестами
  server.resetHandlers();
  // Возвращаем стор в исходное состояние между тестами
  act(() => {
    store.dispatch(removeUserAction());
  });
});

afterAll(() => {
  // Закройте сервер msw после всех тестов
  server.close();
});
