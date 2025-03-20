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

import { Tooltip } from "react-tooltip";
import Latex from "react-latex-next";

import Counter from "./counter";
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
  const [nodeCount, setNodeCount] = useState(6);
  const [relations, setRelations] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [connections, setConnections] = useState("{}");
  const [relationName, setRelationName] = useState("HasBeenTaughtBy");
  const [isEditing, setIsEditing] = useState(false);

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

    const nodeLabels = [
      "Parsa",
      "Mahin",
      "Shajan",
      "Steph",
      "Antonina",
      "Noah",
    ];

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
    const newEdges = [];
    if (nodeCount > 3) {
      newEdges.push(
        { id: "e1-4", source: "1", target: "4", type: "floating" },
        { id: "e2-4", source: "2", target: "4", type: "floating" },
        { id: "e3-4", source: "3", target: "4", type: "floating" }
      );
    }
    if (nodeCount >= 5) {
      newEdges.push(
        { id: "e1-5", source: "1", target: "5", type: "floating" },
        { id: "e5-5", source: "5", target: "5", type: "selfLoop" },
        { id: "e4-4", source: "4", target: "4", type: "selfLoop" }
      );
    }
    if (nodeCount >= 6) {
      newEdges.push(
        { id: "e6-5", source: "6", target: "5", type: "floating" },
        { id: "e1-6", source: "1", target: "6", type: "floating" },
        { id: "e6-6", source: "6", target: "6", type: "selfLoop" }
      );
    }
    setEdges(newEdges);
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

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e) => {
    setRelationName(e.target.value);
    setIsEditing(false);
  };

  return (
    <div id="layout">
      {/* Sidebar */}
      <div id="sidebar">
        <div className="counter-section">
          <p>Nodes:</p>
          <Counter value={nodeCount} onChange={setNodeCount} />
        </div>
        <div id="node-info">
          <h3>Relation Properties:</h3>
          <p>
            <a className="reflexive">
              Reflexive: {relations.reflexive?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".reflexive"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Reflexive states that all nodes point to themselves, formally:
                <center>
                  <Latex>$\forall x xRx$</Latex>
                </center>
                <br />
                {relations.reflexive?.result ? (
                  <span>
                    This relation is reflexive as all nodes point to themselves.
                  </span>
                ) : (
                  <span> {relations.reflexive?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="anti-reflexive">
              Anti-Reflexive: {relations.antiReflexive?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".anti-reflexive"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Anti-Reflexive states that no nodes point to themselves,
                formally:
                <center>
                  <Latex>$\forall x \neg xRx$</Latex>
                </center>
                <br />
                {relations.antiReflexive?.result ? (
                  <span>
                    This relation is Anti-reflexive as all nodes do not point to
                    themselves.
                  </span>
                ) : (
                  <span> {relations.antiReflexive?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="symmetric">
              Symmetric: {relations.symmetric?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".symmetric"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Symmetric states that for all nodes, if a node points to
                another, the other must point back, formally:
                <center>
                  <Latex>$\forall x \forall y(xRy \implies yRx)$</Latex>
                </center>
                <br />
                {relations.symmetric?.result ? (
                  <span>
                    This relation is symmetric as all pairs of nodes either do
                    not point to each other, or they both point to each other.
                  </span>
                ) : (
                  <span> {relations.symmetric?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="anti-symmetric">
              Anti-Symmetric: {relations.antiSymmetric?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".anti-symmetric"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Anti-symmetric states that for all nodes, two different nodes do
                not both point to each other, formally:
                <center>
                  <Latex>
                    $\forall x \forall y (xRy \wedge yRx \implies x = y)$
                  </Latex>
                </center>
                <br />
                {relations.antiSymmetric?.result ? (
                  <span>
                    This relation is Anti-Symmetric, as no two distinct nodes
                    both point to each other.
                  </span>
                ) : (
                  <span>{relations.antiSymmetric?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="transitive">
              Transitive: {relations.transitive?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".transitive"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Transitive states that for all nodes, if between any three nodes
                say a, b, and c, there is an edge from a to b and b to c, there
                must exist an edge from a to c. formally:
                <center>
                  <Latex>
                    $\forall x \forall y \forall z ((xRy \wedge yRz) \implies
                    xRz)$
                  </Latex>
                </center>
                <br />
                {relations.transitive?.result ? (
                  <span>
                    This relation is Transitive, as all trio of nodes satisfy
                    the condition above.
                  </span>
                ) : (
                  <span> {relations.transitive?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="equivalent">
              Equivalence Relation: {relations.equivalent?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".equivalent"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Equivalence relation states that the relation is Reflexive,
                Symmetric and Transitive.
                <br />
                {relations.equivalent?.result ? (
                  <span>
                    This relation is equivalent as it satisfies all of the three
                    conditions.
                  </span>
                ) : (
                  <span> {relations.equivalent?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="partial">
              Partial Order Relation: {relations.partial?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".partial"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Partial order relation states that the relation is Reflexive,
                Anti-symmetric and Transitive.
                <br />
                {relations.partial?.result ? (
                  <span>
                    This relation is partial order as it satisfies all of the
                    three conditions.
                  </span>
                ) : (
                  <span> {relations.partial?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="total">
              Total Order Relation: {relations.total?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".total"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Total order relation states that the relation is a partial order
                relation and it satisfies totality. Totality means that for all
                two nodes, at least one points to the other. Formally:
                <center>
                  <Latex>$\forall x \forall y (x R y \lor y R x)$</Latex>
                </center>
                <br />
                {relations.total?.result ? (
                  <span>This relation satisfies both conditions</span>
                ) : (
                  <span> {relations.total?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
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
          zoomOnScroll={false}
          preventScrolling={false}
          fitView
          fitViewOptions={{
            padding: 0.4, // Adjust padding to control zoom level
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
          <h3>
            {isEditing ? (
              <input
                type="text"
                defaultValue={relationName}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              <span onDoubleClick={handleDoubleClick}>
                <center>{relationName} =</center>
              </span>
            )}
          </h3>
          <p>{connections}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
