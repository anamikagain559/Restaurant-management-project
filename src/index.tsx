import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { router } from "./Routes/Routes";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate>
    </Provider>
);