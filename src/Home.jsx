import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div id="home-container">
        <h1>Intuitive CS</h1>
        <p>
          Hello World! This website is made to interactively visualise and grasp
          the intuition behind key computer science concepts.
        </p>
        <p>
          We hope students learn and teachers teach more effectively with these
          resource!
        </p>
        <div>
          <h3>Topics:</h3>
          <span id="home-links">
            <p>
              <Link to="/FPRpage">Functions, Predicates and Relations</Link>
            </p>
            <p>More coming.....</p>
          </span>
        </div>
      </div>
    </>
  );
};

export default Home;
