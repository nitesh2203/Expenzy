import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Components/navbar";
import HeroPage from "./Components/heropage";
import Login from "./Components/login";
import Signup from "./Components/signup";
import Home from "./Components/home";
import Transactions from "./Components/transactions";
import Budget from "./Components/budget";
import Jobs from "./Components/jobs"
import "./index.css";
import Reports from "./Components/reports";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");

    // Check if user is logged in (this can be replaced with actual authentication logic)
    const user = localStorage.getItem("user"); // Example: Store user session in localStorage
    setIsAuthenticated(!!user);
  }, [darkMode]);


  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroPage darkMode={darkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/signup" element={<Signup darkMode={darkMode} />} />
        <Route path="/home" element={<Home darkMode={darkMode} />} />
        <Route path="/transactions" element={<Transactions darkMode={darkMode} />}  />
        <Route path="/budgets" element={<Budget darkMode={darkMode} />} />
        <Route path="/jobs" element={<Jobs darkMode={darkMode} />} />
        <Route path="/reports" element={<Reports darkMode={darkMode} />} />
      </Routes>
    </Router>
  );
}

export default App;
