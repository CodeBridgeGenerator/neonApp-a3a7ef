import React from "react";
import { render, screen } from "@testing-library/react";

import CartItemPage from "../CartItemPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders cartItem page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CartItemPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("cartItem-datatable")).toBeInTheDocument();
  expect(screen.getByRole("cartItem-add-button")).toBeInTheDocument();
});
