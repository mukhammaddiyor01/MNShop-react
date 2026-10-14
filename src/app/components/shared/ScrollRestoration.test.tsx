import { act, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { ScrollRestoration } from "./ScrollRestoration";

test("opens pushed routes at the top and restores the previous scroll position", () => {
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const scrollTo = jest.fn();
  Object.defineProperty(window, "scrollY", { configurable: true, value: 720 });
  Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    },
  });
  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: jest.fn(),
  });

  const view = render(
    <Router history={history}>
      <ScrollRestoration />
    </Router>,
  );

  act(() => history.push("/products?category=tshirts"));
  view.rerender(
    <Router history={history}>
      <ScrollRestoration />
    </Router>,
  );
  expect(scrollTo).toHaveBeenLastCalledWith({
    top: 0,
    left: 0,
    behavior: "auto",
  });

  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  act(() => history.goBack());
  view.rerender(
    <Router history={history}>
      <ScrollRestoration />
    </Router>,
  );
  expect(scrollTo).toHaveBeenLastCalledWith({
    top: 720,
    left: 0,
    behavior: "auto",
  });
});
