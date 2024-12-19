import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import User from "./pages/User";
import Browse from "./pages/Browse";
import Request from "./pages/Request";
import AdminDashboard from "./pages/AdminDashboard";
import PayPage from "./pages/Pay";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} /> 
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/request" element={<Request />} />
        <Route path="/pay" element={<PayPage />} />
      </Routes>
    </Router>
  );
};

export default App;
