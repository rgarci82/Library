import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/adminLogin"; // Capitalized
import AdminRegister from "./pages/adminRegister"; // Capitalized
import User from "./pages/User"; // Renamed to Users (should match your actual filename)
import Browse from "./pages/Browse";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} /> {/* Ensure your file is Users.tsx */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </Router>
  );
};

export default App;
