import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from "@xyflow/react";

import FloatingEdge from "./FloatingEdge";
import CustomNode from "./CustomNode";
import CustomConnectionLine from "./CustomConnectionLine";

import "./index.css";
import Counter from "./counter";

const edgeTypes = {
  floating: FloatingEdge,
};

const rfStyle = {
  backgroundColor: "#F7F9FB",
};

const defaultEdgeOptions = {
  type: "floating",
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#293a42",
  },
  style: { stroke: "#293a42", strokeWidth: 3 },
};

const connectionLineStyle = {
  stroke: "#293a42",
  strokeWidth: 3,
};

const Predicates = () => {
  const [nodes, setNodes] = useState([]);
  //   const [edges, setEdges] = useState([]);
  const [edges, setEdges] = useState([
    {
      id: "e1",
      source: "A-1",
      target: "B-1",
      type: "floating",
      style: { stroke: "#293a42", strokeWidth: 3 },
    },
    {
      id: "e2",
      source: "A-2",
      target: "B-1",
      type: "floating",
      style: { stroke: "#293a42", strokeWidth: 3 },
    },
    {
      id: "e3",
      source: "A-3",
      target: "B-1",
      type: "floating",
      style: { stroke: "#293a42", strokeWidth: 3 },
    },
    {
      id: "e4",
      source: "A-4",
      target: "B-2",
      type: "floating",
      style: { stroke: "#293a42", strokeWidth: 3 },
    },
    {
      id: "e5",
      source: "A-5",
      target: "B-2",
      type: "floating",
      style: { stroke: "#293a42", strokeWidth: 3 },
    },
  ]);
  const [connections, setConnections] = useState("{}");
  const [predicateName, setPredicateName] = useState("IsStudent");
  const [isEditing, setIsEditing] = useState(false);
  const [domainCount, setDomainCount] = useState(5);

  const updateNodes = useCallback(() => {
    const domainLabels = ["Parsa", "Mahin", "Shajan", "Steph", "Antonina"];
    const codomainLabels = ["True", "False"];

    // Generate domain nodes based on domainCount
    const domainNodes = Array.from({ length: domainCount }, (_, i) => ({
      id: `A-${i + 1}`,
      type: "custom",
      data: { label: domainLabels[i % domainLabels.length] },
      position: { x: 50, y: i * 100 + 20 },
      parentId: "A",
      extent: "parent",
      selectable: true,
      draggable: false,
      className: "group-a-node",
    }));

    // Generate codomain nodes (fixed to True and False)
    const codomainNodes = codomainLabels.map((label, i) => ({
      id: `B-${i + 1}`,
      type: "custom",
      data: { label },
      position: { x: 50, y: i * 100 + 20 },
      parentId: "B",
      extent: "parent",
      selectable: true,
      draggable: false,
      className: "group-b-node",
    }));

    // Update the main nodes
    setNodes([
      {
        id: "A",
        type: "group",
        position: { x: 0, y: -domainCount * 25 },
        data: { label: "Domain" },
        style: { width: 200, height: domainCount * 100 + 50 },
      },
      ...domainNodes,
      {
        id: "B",
        type: "group",
        position: { x: 350, y: 0 },
        data: { label: "Codomain" },
        style: { width: 200, height: 250 },
      },
      ...codomainNodes,
    ]);
  }, [domainCount]);

  useEffect(() => {
    updateNodes();
  }, [updateNodes]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "floating",
            animated: true,
            style: { stroke: "#293a42", strokeWidth: 3 },
          },
          eds
        )
      ),
    []
  );

  useEffect(() => {
    if (edges.length === 0) {
      setConnections("{}");
    } else {
      const connectionList = edges
        .filter((edge) => {
          const targetNode = nodes.find((n) => n.id === edge.target);
          return targetNode?.data.label === "True";
        })
        .map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          return sourceNode?.data.label || edge.source;
        });
      setConnections(`{${connectionList.join(", ")}}`);
    }
  }, [edges, nodes]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    setPredicateName(e.target.value);
    setIsEditing(false);
  };

  const nodeTypes = {
    custom: (props) => <CustomNode {...props} setNodes={setNodes} />,
  };

  return (
    <div id="layout">
      <div id="sidebar">
        <div className="counter-section">
          <p>Domain:</p>
          <Counter value={domainCount} onChange={setDomainCount} />
        </div>
      </div>
      <div id="main-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          zoomOnScroll={false}
          preventScrolling={false}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          style={rfStyle}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Background />
        </ReactFlow>
        <div id="connections-info">
          <h3>
            {isEditing ? (
              <input
                type="text"
                defaultValue={predicateName}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <span onDoubleClick={handleDoubleClick}>
                <center>{predicateName}</center>
              </span>
            )}
          </h3>
          <p>{connections}</p>
        </div>
      </div>
    </div>
  );
};

export default Predicates;
