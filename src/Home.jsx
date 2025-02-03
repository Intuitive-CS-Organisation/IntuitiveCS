import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import logo from "./assets/logo.png";

const Home = () => {
  return (
    <>
      <div id="home-container">
        <img src={logo} alt="Intuitive CS Logo" id="home-logo" />
        <p>
          Hello World! This website is made to interactively visualise and grasp
          the intuition behind key computer science concepts.
        </p>
        <p>
          We hope students learn and teachers teach more effectively with this
          resource!
        </p>
        <div>
          <h3>Topics:</h3>
          <div id="home-links">
            <Link to="/FPRpage">Functions, Predicates, and Relations</Link>
            <Link to="/GraphPage">Graphs</Link>
            Exciting additions ahead!
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
