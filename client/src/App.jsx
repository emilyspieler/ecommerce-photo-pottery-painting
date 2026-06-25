import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { CartProvider } from "./Context/CartContext";
import HomePage from "./Pages/HomePage";
import SuccessPage from "./Pages/SuccessPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
