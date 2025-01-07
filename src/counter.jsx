import React from "react";

function Counter({ value, onChange }) {
  const increment = () => {
    onChange((prevCount) => (prevCount < 5 ? prevCount + 1 : prevCount));
  };

  const decrement = () => {
    onChange((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  return (
    <div className="counter">
      <input value={value} id="count" readOnly />
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;
