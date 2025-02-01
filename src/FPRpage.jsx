import React from "react";
import Functions from "./Functions";
import App from "./App";
import Dropdown from "./Dropdown";
import textContent from "./textContent";
import Predicates from "./Predicates";

const FPR = () => {
  return (
    <div id>
      <h1>
        <center>Functions, Predicates, and Relations</center>
      </h1>
      {/* <p>
        <center>{textContent}</center>
      </p> */}
      <div className="section">
        <h3>
          <center>
            <Dropdown title="Functions" content="" />
          </center>
        </h3>
        <div className="visualization">
          <Functions />
        </div>
      </div>
      <div className="section">
        <h3>
          <center>
            <Dropdown title="Predicates" content="" />
          </center>
        </h3>
        <div className="visualization">
          <Predicates />
        </div>
      </div>
      <div className="section">
        <h3>
          <center>
            <Dropdown title="Relations" content="" />
          </center>
        </h3>
        <div className="visualization">
          <App />
        </div>
      </div>
    </div>
  );
};

export default FPR;
