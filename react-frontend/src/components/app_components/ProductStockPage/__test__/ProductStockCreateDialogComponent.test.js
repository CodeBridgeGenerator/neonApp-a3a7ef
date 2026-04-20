import React from "react";
import { render, screen } from "@testing-library/react";

import ProductStockCreateDialogComponent from "../ProductStockCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders productStock create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProductStockCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("productStock-create-dialog-component"),
  ).toBeInTheDocument();
});
