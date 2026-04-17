import React from "react";
import { render, screen } from "@testing-library/react";

import ProductStockPage from "../ProductStockPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../../models";

test("renders productStock page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ProductStockPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("productStock-datatable")).toBeInTheDocument();
    expect(screen.getByRole("productStock-add-button")).toBeInTheDocument();
});
