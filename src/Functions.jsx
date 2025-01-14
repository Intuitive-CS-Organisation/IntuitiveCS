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

import { analyzeFunctionTypes } from "./FunctionsLogic";

import "./index.css";

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
  const [functionType, setFunctionType] = useState("Unknown");
  const [connections, setConnections] = useState("{}");
  const [functionName, setFunctionName] = useState("FunctionName");
  const [isEditing, setIsEditing] = useState(false);

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
    setFunctionType(analyzeFunctionTypes(nodes, edges));
  }, [nodes, edges]);

  const nodeTypes = {
    custom: (props) => <CustomNode {...props} setNodes={setNodes} />,
  };

  return (
    <div id="layout">
      <div id="sidebar">
        <h3>Function Type:</h3>
        <p>{functionType}</p>
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
            padding: 0.5,
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
