// Function to analyze the connections
export const analyzeFunctionTypes = (nodes, edges) => {
    const nodeIds = nodes.map((node) => node.id);
    const connectionMap = {};
  
    // Initialize the map
    nodeIds.forEach((id) => {
      connectionMap[id] = { incoming: 0, outgoing: 0 };
    });
  
    // Count incoming and outgoing edges for each node
    edges.forEach((edge) => {
      const { source, target } = edge;
      if (connectionMap[source]) connectionMap[source].outgoing += 1;
      if (connectionMap[target]) connectionMap[target].incoming += 1;
    });
  
    let type = "Unknown";
  
    const allIncoming = Object.values(connectionMap).map((node) => node.incoming);
    const allOutgoing = Object.values(connectionMap).map((node) => node.outgoing);
  
    const hasOneToOne = allIncoming.every((count) => count <= 1) && allOutgoing.every((count) => count <= 1);
    const hasOneToMany = allOutgoing.some((count) => count > 1) && allIncoming.every((count) => count <= 1);
    const hasManyToOne = allIncoming.some((count) => count > 1) && allOutgoing.every((count) => count <= 1);
    const hasManyToMany = allIncoming.some((count) => count > 1) && allOutgoing.some((count) => count > 1);
  
    if (hasOneToOne) type = "1-to-1";
    if (hasOneToMany) type = "1-to-Many";
    if (hasManyToOne) type = "Many-to-1";
    if (hasManyToMany) type = "Many-to-Many";
  
    return type;
  };
  