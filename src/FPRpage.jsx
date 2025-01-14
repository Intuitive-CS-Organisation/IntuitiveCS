import React from "react";
import Functions from "./Functions";
import App from "./App";
import Dropdown from "./Dropdown";

const FPR = () => {
  return (
    <div id>
      <h1>
        <center>Functions/Predicates/Relations</center>
      </h1>
      <p>
        <center>
          Relations are types of predicates, and predicates are types of
          functions. To read more about understanding each concept, press on the
          "down arrow" next to each topic's visualizer.
        </center>
      </p>
      <div className="section">
        <h3>
          <center>
            <Dropdown
              title="Functions"
              content="A function is a relation between a set of inputs and a set of permissible outputs with the property that each input is related to exactly one output."
            />
          </center>
        </h3>
        <div className="visualization">
          <Functions />
        </div>
      </div>
      <div className="section">
        <h3>
          <center>
            <Dropdown
              title="Relations"
              content="A function is a relation between a set of inputs and a set of permissible outputs with the property that each input is related to exactly one output."
            />
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
