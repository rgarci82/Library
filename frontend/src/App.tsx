import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin"; // Capitalized
import AdminRegister from "./pages/AdminRegister"; // Capitalized
import User from "./pages/User"; // Renamed to Users (should match your actual filename)
import Browse from "./pages/Browse";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRouteAdmin";

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} /> {/* Ensure your file is Users.tsx */}
        <Route path="/adminLogin" element={<AdminLogin onLogin={handleAdminLogin} />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/adminDashboard" element={<ProtectedRoute isAdmin={isAdmin} element={<AdminDashboard />} />} />
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </Router>
  );
};

export default App;
