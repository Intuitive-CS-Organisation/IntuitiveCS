import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./Home.jsx";
import Functions from "./Functions.jsx";
import HamburgerMenu from "./HamburgerMenu.jsx";
import FPR from "./FPRpage.jsx";
import Contact from "./Contact.jsx"; // <--- import the new file
import About from "./About.jsx"; // Import the About component

function Main() {
  return (
    <Router>
      <HamburgerMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FPRpage" element={<FPR />} />
        {/* <Route path="/app" element={<App />} />
        <Route path="/functions" element={<Functions />} /> */}
        {/* The new contact route */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
