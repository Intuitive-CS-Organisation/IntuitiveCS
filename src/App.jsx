import React, { useEffect, useCallback, useState } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";
import SelfConnectingEdge from "./SelfConnectingEdge";

import Counter from "./counter"; // Import Counter component
import {
  isReflexive,
  isAntiReflexive,
  isSymmetric,
  isAntiSymmetric,
  isTransitive,
  isEquivalenceRelation,
  isPartialOrder,
  isTotal,
  isTotalOrder,
} from "./RelationsLogic";

const connectionLineStyle = {
  stroke: "#293a42",
  strokeWidth: 3,
};

const edgeTypes = {
  floating: FloatingEdge,
  selfLoop: SelfConnectingEdge,
};

const defaultEdgeOptions = {
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#293a42",
  },
};

const App = () => {
  const [nodeCount, setNodeCount] = useState(3);
  const [relations, setRelations] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connections, setConnections] = useState("{}");

  // Define nodeTypes within the scope of App to access setNodes
  const nodeTypes = {
    custom: (props) => <CustomNode {...props} setNodes={setNodes} />,
  };

  useEffect(() => {
    const calculatePositions = (count) => {
      const centerX = 400;
      const centerY = 300;
      const radius = 250;

      if (count === 1) {
        return [{ x: centerX, y: centerY }];
      }

      const positions = [];
      for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push({ x, y });
      }
      return positions;
    };

    const nodeLabels = ["Parsa", "Mahin", "Shajan", "Steph", "Antonio"];

    const newNodes = Array.from({ length: nodeCount }, (_, i) => {
      const positions = calculatePositions(nodeCount);
      return {
        id: (i + 1).toString(),
        type: "custom",
        position: positions[i],
        data: { label: nodeLabels[i % nodeLabels.length] },
      };
    });

    setNodes(newNodes);
    setEdges([]);
  }, [nodeCount, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => {
      const edgeType =
        params.source === params.target ? "selfLoop" : "floating";
      setEdges((eds) => addEdge({ ...params, type: edgeType }, eds));
    },
    [setEdges]
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

  useEffect(() => {
    const nodeLabels = nodes.map((node) => node.data.label);
    const relations = {
      reflexive: isReflexive(nodeLabels, connections),
      antiReflexive: isAntiReflexive(connections),
      symmetric: isSymmetric(connections),
      antiSymmetric: isAntiSymmetric(connections),
      transitive: isTransitive(connections),
      equivalent: isEquivalenceRelation(nodeLabels, connections),
      partial: isPartialOrder(nodeLabels, connections),
      totality: isTotal(nodeLabels, connections),
      total: isTotalOrder(nodeLabels, connections),
    };
    setRelations(relations);
  }, [connections, nodes, setRelations]);

  return (
    <div id="layout">
      {/* Sidebar */}
      <div id="sidebar">
        <Counter value={nodeCount} onChange={setNodeCount} />
        <div id="node-info">
          <h3>Properties:</h3>
          <p>Reflexive: {relations.reflexive ? "Yes" : "No"}</p>
          <p>Anti-Reflexive: {relations.antiReflexive ? "Yes" : "No"}</p>
          <p>Symmetric: {relations.symmetric ? "Yes" : "No"}</p>
          <p>Anti-Symmetric: {relations.antiSymmetric ? "Yes" : "No"}</p>
          <p>Transitive: {relations.transitive ? "Yes" : "No"}</p>
          <h3>Relation:</h3>
          <p>Equivalence Relation: {relations.equivalent ? "Yes" : "No"}</p>
          <p>Partial Order Relation: {relations.partial ? "Yes" : "No"}</p>
          <p>Total Order Relation: {relations.total ? "Yes" : "No"}</p>
        </div>
      </div>

      {/* Main Area */}
      <div id="main-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{
            padding: 0.3, // Adjust padding to control zoom level
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          style={{ backgroundColor: "#F7F9FB" }}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
        >
          <Background />
        </ReactFlow>
        <div id="connections-info">
          <h3>Current Connections:</h3>
          <p>{connections}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
