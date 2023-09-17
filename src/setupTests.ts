// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { server } from './mock/mockServiceWorker';

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
});

afterAll(() => {
  // Закройте сервер msw после всех тестов
  server.close();
});
