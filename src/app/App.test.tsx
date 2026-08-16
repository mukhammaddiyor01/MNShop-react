import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

test("renders the home page", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  expect(getByText(/home/i)).toBeInTheDocument();
});
