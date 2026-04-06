import "./Scss/style.scss"; // or wherever your main SCSS lives

import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import { router } from "./Routes";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
