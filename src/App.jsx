import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import ExplorePage from "./components/ExplorePage";
import CartPage from "./components/CartPage";
import OrdersPage from "./components/OrdersPage";
import { CartProvider } from "./contexts/CartContext";
import CheckoutPage from "./components/CheckoutPage";
import TestRoute from "./components/TestRoute";
import LoginPage2 from "./components/LoginPage2";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminOrders from "./components/admin/AdminOrders";
import AdminProducts from "./components/admin/AdminProducts";
import AdminUsers from "./components/admin/AdminUsers";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import ContactUs from "./components/Contact";
import Terms from "./components/Terms";
import OrderSuccessPage from "./components/OrderSuccess";


import CameraDetail from "./components/CameraDeatil";
function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login2" element={<LoginPage2 />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<CameraDetail />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/Terms" element={<Terms />} /> 
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/testRoute" element={<ContactUs />} />

          
           <Route element={<AdminRoute/>}>
          <Route  element={<AdminLayout/>}>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} /></Route></Route>

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
