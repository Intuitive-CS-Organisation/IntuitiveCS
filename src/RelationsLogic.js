// Function to parse the connections string into an array of tuples
const parseConnections = (connections) => {
  // Remove outer braces and split connections
  const cleanConnections = connections.replace(/[{}]/g, "").trim();

  if (!cleanConnections) return []; // Handle empty connections gracefully

  // Split into individual pairs and map into tuples
  return cleanConnections
    .split("),")
    .map((pair) => pair.replace(/[()]/g, "").trim().split(","));
};


// Check if the relation is reflexive gives the conterexample when not
export const isReflexive = (nodes, connections) => {
  const relation = parseConnections(connections);
  let missingNodes = [];

  for (const node of nodes) {
    if (!relation.some(([a, b]) => a === node && b === node)) {
      missingNodes.push(`${node}`);
    }
  }

  if (missingNodes.length > 0) {
    return { result: false, counterexample: `This relation is not reflexive as ${missingNodes.join(", ")} do not point to themselves.` };
  }

  return { result: true, counterexample: null };
};



// Check if the relation is anti-reflexive
// export const isAntiReflexive = (connections) => {
//   const relation = parseConnections(connections);
//   return relation.every(([a, b]) => a !== b);
// };

export const isAntiReflexive = (connections) => {
  const relation = parseConnections(connections);
  let invalidNodes = [];

  // Check for any self-loops in the relation
  relation.forEach(([a, b]) => {
    if (a === b) {
      invalidNodes.push(`${a}`);
    }
  });

  // If invalidNodes is not empty, the relation is not anti-reflexive
  if (invalidNodes.length > 0) {
    return {
      result: false,
      counterexample: `This relation is not Anti-reflexive as ${invalidNodes.join(", ")} point to themselves.`,
    };
  }

  // If no self-loops are found, the relation is anti-reflexive
  return {
    result: true,
    counterexample: null,
  };
};

// Check if the relation is symmetric
// export const isSymmetric = (connections) => {
//   const relation = parseConnections(connections);
//   return relation.every(
//     ([a, b]) => a === b || relation.some(([x, y]) => x === b && y === a)
//   );
// };

export const isSymmetric = (connections) => {
  const relation = parseConnections(connections);
  let missingSymmetry = [];
  let oppositeSymmetry = [];


  // Check for symmetric pairs
  relation.forEach(([a, b]) => {
    if (a !== b && !relation.some(([x, y]) => x === b && y === a)) {
      missingSymmetry.push(`(${a},${b})`);
      oppositeSymmetry.push(`(${b},${a})`);
    }
  });

  // If there are missing symmetric pairs, return false with counterexample
  if (missingSymmetry.length > 0) {
    return {
      result: false,
      counterexample: `This relation is not symmetric as the edges ${missingSymmetry.join(", ")} exist, however their symmetric pairs ${oppositeSymmetry.join(", ")} do not exist.`,
    };
  }

  // If all pairs are symmetric, return true
  return {
    result: true,
    counterexample: null,
  };
};

// Check if the relation is anti-symmetric
// export const isAntiSymmetric = (connections) => {
//   const relation = parseConnections(connections);
//   return relation.every(
//     ([a, b]) => a === b || !relation.some(([x, y]) => x === b && y === a)
//   );
// };

export const isAntiSymmetric = (connections) => {
  const relation = parseConnections(connections);
  let invalidPairs = new Set(); // Track already-processed pairs

  // Check for anti-symmetric violations
  relation.forEach(([a, b]) => {
    if (
      a !== b &&
      relation.some(([x, y]) => x === b && y === a && !invalidPairs.has(`${b},${a}`))
    ) {
      invalidPairs.add(`${a},${b}`); // Add only one direction
    }
  });

  // If invalid pairs exist, return false with counterexample
  if (invalidPairs.size > 0) {
    const counterexample = Array.from(invalidPairs)
      .map((pair) => {
        const [x, y] = pair.split(",");
        return `(${x}, ${y}) and (${y}, ${x}) but ${x} ≠ ${y}`;
      })
      .join(", ");
    return {
      result: false,
      counterexample: `This relation is not Anti-Symmetric, as ${counterexample}`,
    };
  }

  // If no violations, return true
  return {
    result: true,
    counterexample: null,
  };
};




// Check if the relation is transitive
// export const isTransitive = (connections) => {
//   const relation = parseConnections(connections);
//   return relation.every(([a, b]) =>
//     relation.every(([x, y]) =>
//       b === x ? relation.some(([c, d]) => c === a && d === y) : true
//     )
//   );
// };

export const isTransitive = (connections) => {
  const relation = parseConnections(connections);
  let missingTransitivity = [];

  // Check for transitive violations
  relation.forEach(([a, b]) => {
    relation.forEach(([x, y]) => {
      if (b === x && !relation.some(([c, d]) => c === a && d === y)) {
        missingTransitivity.push(`(${a},${b}) and (${b},${y}) exist but (${a},${y}) does not`);
      }
    });
  });

  // If there are missing transitive links, return false with counterexample
  if (missingTransitivity.length > 0) {
    return {
      result: false,
      counterexample: `This relation is not transitive, as the edges ${missingTransitivity.join("; ")}.`,
    };
  }

  // If all pairs satisfy transitivity, return true
  return {
    result: true,
    counterexample: null,
  };
};



// export const isEquivalenceRelation = (nodes,connections) => {
//   return(
//     isReflexive(nodes,connections).result && isSymmetric(connections).result && isTransitive(connections).result
//   );
// };

export const isEquivalenceRelation = (nodes, connections) => {
  const reflexiveResult = isReflexive(nodes, connections).result;
  const symmetricResult = isSymmetric(connections).result;
  const transitiveResult = isTransitive(connections).result;

  // Collect all failing properties
  let failingReasons = [];
  if (!reflexiveResult) failingReasons.push("not reflexive");
  if (!symmetricResult) failingReasons.push("not symmetric");
  if (!transitiveResult) failingReasons.push("not transitive");

  // If any property fails, return the reasons
  if (failingReasons.length > 0) {
    return {
      result: false,
      counterexample: `It is not equivalent as it is ${failingReasons.join(" and ")}.`,
    };
  }

  // If all properties hold, it is an equivalence relation
  return {
    result: true,
    counterexample: null,
  };
};


// export const isPartialOrder = (nodes,connections) => {
//   return(
//     isReflexive(nodes,connections).result && isAntiSymmetric(connections).result && isTransitive(connections).result
//   );
// };

export const isPartialOrder = (nodes,connections) => {
  const reflexiveResult = isReflexive(nodes, connections).result;
  const antiSymmetricResult = isAntiSymmetric(connections).result;
  const transitiveResult = isTransitive(connections).result;

  // Collect all failing properties
  let failingReasons = [];
  if (!reflexiveResult) failingReasons.push("not reflexive");
  if (!antiSymmetricResult) failingReasons.push("not anti-symmetric");
  if (!transitiveResult) failingReasons.push("not transitive");

  // If any property fails, return the reasons
  if (failingReasons.length > 0) {
    return {
      result: false,
      counterexample: `It is not partial order as it is ${failingReasons.join(" and ")}.`,
    };
  }

  // If all properties hold, it is an equivalence relation
  return {
    result: true,
    counterexample: null,
  };
};

// Function to check if a relation is total (totality condition)
// export const isTotal = (nodes, connections) => {
//   const relation = parseConnections(connections);

//   // Check if for every pair of nodes (a, b), either (a, b) or (b, a) exists
//   for (let i = 0; i < nodes.length; i++) {
//     for (let j = 0; j < nodes.length; j++) {
//       if (i !== j) {
//         const a = nodes[i];
//         const b = nodes[j];
//         const hasAB = relation.some(([x, y]) => x === a && y === b);
//         const hasBA = relation.some(([x, y]) => x === b && y === a);

//         if (!hasAB && !hasBA) {
//           return false; // Totality condition is violated
//         }
//       }
//     }
//   }

//   return true; // Totality condition satisfied
// };

export const isTotal = (nodes, connections) => {
  const relation = parseConnections(connections);
  let missingPairs = new Set();

  // Check for self-loops (a node must relate to itself)
  nodes.forEach((node) => {
    const hasSelfLoop = relation.some(([x, y]) => x === node && y === node);
    if (!hasSelfLoop) {
      missingPairs.add(`${node},${node}`);
    }
  });

  // Check if for every pair of distinct nodes (a, b), either (a, b) or (b, a) exists
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) { // Only check pairs once
      const a = nodes[i];
      const b = nodes[j];
      const hasAB = relation.some(([x, y]) => x === a && y === b);
      const hasBA = relation.some(([x, y]) => x === b && y === a);

      if (!hasAB && !hasBA) {
        missingPairs.add(`${a},${b}`);
      }
    }
  }

  // If there are missing pairs, return false with a counterexample
  if (missingPairs.size > 0) {
    return {
      result: false,
      counterexample: `does not satisfy totality because the following nodes do not relate to each other: ${Array.from(missingPairs).join("; ")}`,
    };
  }

  // If all pairs satisfy totality
  return {
    result: true,
    counterexample: null,
  };
};




// Function to check if a relation is a total order
// export const isTotalOrder = (nodes, connections) => {
//   return isPartialOrder(nodes, connections) && isTotal(nodes, connections);
// };

export const isTotalOrder = (nodes, connections) => {
  const partialOrderResult = isPartialOrder(nodes, connections);
  const totalResult = isTotal(nodes, connections);
  let reasons = [];

  // Check partial order
  if (!partialOrderResult.result) {
    reasons.push("does not satisfy partial order");
  }

  // Check totality
  if (!totalResult.result) {
    reasons.push(`${totalResult.counterexample}`);
  }

  // If either condition fails, return combined reasons
  if (reasons.length > 0) {
    return {
      result: false,
      counterexample: `This relation ${reasons.join(" and ")}.`,
    };
  }

  // If both partial order and totality are satisfied
  return {
    result: true,
    counterexample: null,
  };
};


