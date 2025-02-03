// // Function to analyze the connections
// export const analyzeFunctionTypes = (nodes, edges) => {
//     const nodeIds = nodes.map((node) => node.id);
//     const connectionMap = {};
  
//     // Initialize the map
//     nodeIds.forEach((id) => {
//       connectionMap[id] = { incoming: 0, outgoing: 0 };
//     });
  
//     // Count incoming and outgoing edges for each node
//     edges.forEach((edge) => {
//       const { source, target } = edge;
//       if (connectionMap[source]) connectionMap[source].outgoing += 1;
//       if (connectionMap[target]) connectionMap[target].incoming += 1;
//     });
  
//     let type = "Unknown";
  
//     const allIncoming = Object.values(connectionMap).map((node) => node.incoming);
//     const allOutgoing = Object.values(connectionMap).map((node) => node.outgoing);
  
//     const hasOneToOne = allIncoming.every((count) => count <= 1) && allOutgoing.every((count) => count <= 1);
//     const hasOneToMany = allOutgoing.some((count) => count > 1) && allIncoming.every((count) => count <= 1);
//     const hasManyToOne = allIncoming.some((count) => count > 1) && allOutgoing.every((count) => count <= 1);
//     const hasManyToMany = allIncoming.some((count) => count > 1) && allOutgoing.some((count) => count > 1);
  
//     if (hasOneToOne) type = "1-to-1";
//     if (hasOneToMany) type = "1-to-Many";
//     if (hasManyToOne) type = "Many-to-1";
//     if (hasManyToMany) type = "Many-to-Many";
  
//     return type;
//   };
  

// export const analyzeFunctionProperties = (nodes, edges) => {
//   const inputNodes = nodes.filter((node) => node.parentId === "A");
//   const outputNodes = nodes.filter((node) => node.parentId === "B");

//   const edgeMap = {};
//   inputNodes.forEach((node) => {
//     edgeMap[node.id] = [];
//   });

//   edges.forEach((edge) => {
//     if (edgeMap[edge.source]) {
//       edgeMap[edge.source].push(edge.target);
//     }
//   });

//   const isFunction = inputNodes.every((node) => edgeMap[node.id]?.length === 1);
//   if (!isFunction) return { isFunction: false, isInjective: false, isSurjective: false, isBijective: false };

//   const allTargets = edges.map((edge) => edge.target);
//   const isInjective = new Set(allTargets).size === allTargets.length; // Unique mappings for injective
//   const isSurjective = outputNodes.every((node) => allTargets.includes(node.id)); // All outputs mapped
//   const isBijective = isInjective && isSurjective;

//   return { isFunction, isInjective, isSurjective, isBijective };
// };

export const analyzeFunctionProperties = (nodes, edges) => {
  const inputNodes = nodes.filter((node) => node.parentId === "A");
  const outputNodes = nodes.filter((node) => node.parentId === "B");

  const edgeMap = {};
  inputNodes.forEach((node) => {
    edgeMap[node.id] = [];
  });

  edges.forEach((edge) => {
    if (edgeMap[edge.source]) {
      edgeMap[edge.source].push(edge.target);
    }
  });

  // Check for function rule violations
  const noOutputs = [];
  const multipleOutputs = [];

  inputNodes.forEach((node) => {
    const outputs = edgeMap[node.id];
    const nodeLabel = `${node?.data?.label || node.id}`;

    if (!outputs || outputs.length === 0) {
      // Rule 1 Violation: No output for an input
      noOutputs.push(nodeLabel);
    } else if (outputs.length > 1) {
      // Rule 2 Violation: More than one output for an input
      const outputLabels = outputs.map((out) => `${nodes.find((n) => n.id === out)?.data?.label || out}`).join(", ");
      multipleOutputs.push(`${nodeLabel} → ${outputLabels}`);
    }
  });

  // Build the function counterexample message
  let functionCounterexample = [];
  if (noOutputs.length > 0) {
    functionCounterexample.push(`An input in its domain does not have an output: ${noOutputs.join(", ")}`);
  }
  if (multipleOutputs.length > 0) {
    functionCounterexample.push(`An input in its domain has more than one output: ${multipleOutputs.join("; ")}`);
  }

  const isFunction = functionCounterexample.length === 0;

  if (!isFunction) {
    return {
      isFunction: {
        result: false,
        counterexample: functionCounterexample.join(" and "),
      },
      isInjective: { result: false, counterexample: "it is not even a function" },
      isSurjective: { result: false, counterexample: "it is not even a function" },
      isBijective: { result: false, counterexample: "it is not even a function" },
    };
  }

  // Injectivity Check
  const outputToInputs = {};
  edges.forEach(({ source, target }) => {
    const sourceNode = nodes.find((n) => n.id === source);
    const targetNode = nodes.find((n) => n.id === target);

    if (!sourceNode || !targetNode) return; // Prevent errors if a node is missing

    const targetLabel = targetNode?.data?.label || target;
    const sourceLabel = sourceNode?.data?.label || source;

    if (!outputToInputs[targetLabel]) {
      outputToInputs[targetLabel] = [];
    }
    outputToInputs[targetLabel].push(sourceLabel);
  });

  const injectiveViolations = [];
  for (const [output, inputs] of Object.entries(outputToInputs)) {
    if (inputs.length > 1) {
      injectiveViolations.push(
        `${inputs[0]} maps to ${output} and ${inputs[1]} also maps to ${output} but ${inputs[0]} and ${inputs[1]} are not equal`
      );
    }
  }

  const isInjective = injectiveViolations.length === 0;

  // Surjectivity Check
  const allTargets = edges
    .map((edge) => nodes.find((n) => n.id === edge.target)?.data?.label)
    .filter(Boolean); // Removes undefined values

  const missingOutputs = outputNodes.filter((node) => !allTargets.includes(node?.data?.label));
  const isSurjective = missingOutputs.length === 0;

  const surjectiveCounterexample = isSurjective
    ? null
    : `there does not exist any element in the domain mapping to: ${missingOutputs.map((n) => `${n?.data?.label || n.id}`).join(", ")}`;

  // Bijective Check
  const isBijective = isInjective && isSurjective;

  return {
    isFunction: { result: true, counterexample: null },
    isInjective: {
      result: isInjective,
      counterexample: isInjective ? null : injectiveViolations.join("; "),
    },
    isSurjective: {
      result: isSurjective,
      counterexample: surjectiveCounterexample
    },
    isBijective: {
      result: isBijective,
      counterexample: isBijective
        ? null
        : `The relation is not bijective because it ${!isInjective ? "is not injective" : ""}${
            !isInjective && !isSurjective ? " and " : ""
          }${!isSurjective ? "is not surjective" : ""}.`,
    },
  };
};

