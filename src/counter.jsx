import React from "react";

function Counter({ value, onChange }) {
  const increment = () => {
    onChange((prevCount) => (prevCount < 6 ? prevCount + 1 : prevCount));
  };

  const decrement = () => {
    onChange((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  return (
    <div className="counter-container">
      <button className="counter-button decrement" onClick={decrement}>
        -
      </button>
      <input value={value} id="count" readOnly className="counter-display" />
      <button className="counter-button increment" onClick={increment}>
        +
      </button>
    </div>
  );
}

export default Counter;
