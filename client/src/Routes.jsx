import { createBrowserRouter } from "react-router-dom";
import Root from "./Layouts/AppTemplate";
import HomePage from "./Pages/HomePage";
import ContactPage from "./Pages/ContactUsPage";
import CartPage from "./Pages/CartPage";
import InventoryUpload from "./Pages/InventoryUpload";
import Login from "./Pages/Login"
import Signup from "./Pages/Signup";
import IndividualProduct from "./Pages/IndividualProduct";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/upload",
        element: <InventoryUpload />,
      },
      {
        path: "/cancel",
        element: <CartPage />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/products/:id",
        element: <IndividualProduct />
      }
    ],
  },
]);