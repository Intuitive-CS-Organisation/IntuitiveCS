import React, { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  MarkerType,
} from "@xyflow/react";

import FloatingEdge from "./FloatingEdge";
import CustomNode from "./CustomNode";
import CustomConnectionLine from "./CustomConnectionLine";

import { analyzeFunctionProperties } from "./FunctionsLogic";

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

const initialNodes = [
  {
    id: "A",
    type: "group",
    position: { x: 0, y: 0 },
    data: { label: "Parent A" },
    style: { width: 200, height: 350 },
  },
  {
    id: "A-1",
    type: "custom",
    data: { label: "a" },
    position: { x: 50, y: 20 },
    parentId: "A",
    extent: "parent",
    selectable: true,
    draggable: false,
    className: "group-a-node",
  },
  {
    id: "A-2",
    type: "custom",
    data: { label: "b" },
    position: { x: 50, y: 120 },
    parentId: "A",
    extent: "parent",
    selectable: true,
    draggable: false,
    className: "group-a-node",
  },
  {
    id: "A-3",
    type: "custom",
    data: { label: "c" },
    position: { x: 50, y: 220 },
    parentId: "A",
    extent: "parent",
    selectable: true,
    draggable: false,
    className: "group-a-node",
  },
  {
    id: "B",
    type: "group",
    position: { x: 350, y: 0 },
    data: { label: "Parent B" },
    style: { width: 200, height: 350 },
  },
  {
    id: "B-1",
    type: "custom",
    data: { label: "x" },
    position: { x: 50, y: 20 },
    parentId: "B",
    extent: "parent",
    selectable: true,
    draggable: false,
    className: "group-b-node",
  },
  {
    id: "B-2",
    type: "custom",
    data: { label: "y" },
    position: { x: 50, y: 120 },
    parentId: "B",
    extent: "parent",
    selectable: true,
    draggable: false,
    className: "group-b-node",
  },
  {
    id: "B-3",
    type: "custom",
    data: { label: "z" },
    position: { x: 50, y: 220 },
    parentId: "B",
    extent: "parent",
    selectable: true,
    draggable: false,
    className: "group-b-node",
  },
];

const Functions = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [functionProperties, setFunctionProperties] = useState({
    isFunction: false,
    isInjective: false,
    isSurjective: false,
    isBijective: false,
  });
  const [connections, setConnections] = useState("{}");
  const [functionName, setFunctionName] = useState("FunctionName");
  const [isEditing, setIsEditing] = useState(false);
  const [domainCount, setDomainCount] = useState(3);
  const [codomainCount, setCodomainCount] = useState(3);

  const updateNodes = useCallback(() => {
    const domainLabels = ["a", "b", "c", "d", "e"];
    const codomainLabels = ["x", "y", "z", "w", "v"];

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

    // Generate codomain nodes based on codomainCount
    const codomainNodes = Array.from({ length: codomainCount }, (_, i) => ({
      id: `B-${i + 1}`,
      type: "custom",
      data: { label: codomainLabels[i % codomainLabels.length] },
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
        position: { x: 0, y: -domainCount * 20 },
        data: { label: "Domain" },
        style: { width: 200, height: domainCount * 100 + 50 },
      },
      ...domainNodes,
      {
        id: "B",
        type: "group",
        position: { x: 350, y: -domainCount * 20 },
        data: { label: "Codomain" },
        style: { width: 200, height: codomainCount * 100 + 50 },
      },
      ...codomainNodes,
    ]);
  }, [domainCount, codomainCount]);

  useEffect(() => {
    updateNodes();
  }, [domainCount, codomainCount, updateNodes]);

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
      const connectionList = edges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        const sourceLabel = sourceNode?.data.label || edge.source;
        const targetLabel = targetNode?.data.label || edge.target;
        return `(${sourceLabel},${targetLabel})`;
      });
      setConnections(`{${connectionList.join(", ")}}`);
    }
  }, [edges, nodes]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    setFunctionName(e.target.value);
    setIsEditing(false);
  };

  useEffect(() => {
    const result = analyzeFunctionProperties(nodes, edges);
    setFunctionProperties(result);
  }, [nodes, edges]);

  const nodeTypes = {
    custom: (props) => <CustomNode {...props} setNodes={setNodes} />,
  };

  return (
    <div id="layout">
      <div id="sidebar">
        {/* <h3>Adjust Domain and Codomain</h3> */}
        <div className="counter-section">
          <p>Domain:</p>
          <Counter value={domainCount} onChange={setDomainCount} />
        </div>
        <div className="counter-section">
          <p>Codomain:</p>
          <Counter value={codomainCount} onChange={setCodomainCount} />
        </div>
        <div id="node-info">
          <h3>Function Properties:</h3>
          <p>Function: {functionProperties.isFunction ? "✔️" : "❌"}</p>
          <p>Injective: {functionProperties.isInjective ? "Yes" : "No"}</p>
          <p>Surjective: {functionProperties.isSurjective ? "Yes" : "No"}</p>
          <p>Bijective: {functionProperties.isBijective ? "Yes" : "No"}</p>
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
            padding: 1,
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
                defaultValue={functionName}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <span onDoubleClick={handleDoubleClick}>
                <center>{functionName}</center>
              </span>
            )}
          </h3>
          <p>{connections}</p>
        </div>
      </div>
    </div>
  );
};

export default Functions;
