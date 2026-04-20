import React from "react";
import { render, screen } from "@testing-library/react";

import CustomerEmailPage from "../CustomerEmailPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders customerEmail page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CustomerEmailPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("customerEmail-datatable")).toBeInTheDocument();
  expect(screen.getByRole("customerEmail-add-button")).toBeInTheDocument();
});
