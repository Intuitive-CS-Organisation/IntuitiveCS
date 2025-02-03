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
import Latex from "react-latex-next";
import Counter from "./counter";

import { Tooltip } from "react-tooltip";

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
  const [edges, setEdges] = useState([
    {
      id: "e1",
      source: "A-1",
      target: "B-2",
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
      target: "B-3",
      type: "floating",
      style: { stroke: "#293a42", strokeWidth: 3 },
    },
    {
      id: "e4",
      source: "A-4",
      target: "B-1",
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
  const [functionProperties, setFunctionProperties] = useState({
    isFunction: { result: false, counterexample: null },
    isInjective: { result: false, counterexample: null },
    isSurjective: { result: false, counterexample: null },
    isBijective: { result: false, counterexample: null },
  });
  const [connections, setConnections] = useState("{}");
  const [functionName, setFunctionName] = useState("Squared");
  const [isEditing, setIsEditing] = useState(false);
  const [domainCount, setDomainCount] = useState(5);
  const [codomainCount, setCodomainCount] = useState(5);

  const updateNodes = useCallback(() => {
    const domainLabels = ["-1", "2", "0", "-2", "1", "3"];
    const codomainLabels = ["4", "1", "0", "2", "-1", "9"];

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
        position: { x: 0, y: -domainCount * 25 },
        data: { label: "Domain" },
        style: { width: 200, height: domainCount * 100 + 50 },
      },
      ...domainNodes,
      {
        id: "B",
        type: "group",
        position: { x: 350, y: -codomainCount * 25 },
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
          <p>
            <a className="function">
              Function: {functionProperties.isFunction?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".function"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                A function is a mapping from some domain D to some Co-Domain C
                such that:
                <center>
                  <Latex>
                    1.{" "}
                    {
                      "$\\forall x \\in D, \\; \\exists y \\in C \\text{ such that } f(x) = y$"
                    }
                  </Latex>
                  <span>
                    , (An input in its domain will always return an output.)
                  </span>
                </center>
                <center>
                  <Latex>
                    2.{" "}
                    {
                      "$\\forall x \\in D, \\; \\neg \\Bigl( \\exists y, z \\in C \\text{ such that } f(x) = y \\wedge f(x) = z \\wedge y \\neq z \\Bigr)$"
                    }
                  </Latex>
                  <span>
                    , (For any given input in the domain, no more than 1 output
                    is returned.)
                  </span>
                </center>
                <br />
                {functionProperties.isFunction?.result ? (
                  <span>
                    The is a function as it satisfies both of the conditions
                    above.
                  </span>
                ) : (
                  <span> {functionProperties.isFunction?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="injective">
              Injective: {functionProperties.isInjective?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".injective"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Injective states that two different inputs do not map to the
                same output. Formally, if D is the Domain:
                <center>
                  <Latex>
                    $\forall a \in D, \forall b \in D, a \neq b \implies f(a)
                    \neq f(b)$
                  </Latex>
                </center>
                <br />
                {functionProperties.isInjective?.result ? (
                  <span>
                    This function is injective as the condition is satisfied.
                  </span>
                ) : (
                  <span>
                    This relation is not injective as{" "}
                    {functionProperties.isInjective?.counterexample}.
                  </span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="surjective">
              Surjective:{" "}
              {functionProperties.isSurjective?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".surjective"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Surjective states that every element in the Co-Domain (Denoted
                C) is mapped to by at least one element in the Domain (Denoted
                D). Formally:
                <center>
                  <Latex>
                    $\forall a \in D, \forall b \in D, a \neq b \implies f(a)
                    \neq f(b)$
                  </Latex>
                </center>
                <br />
                {functionProperties.isSurjective?.result ? (
                  <span>
                    This function is surjective as the condition is satisfied.
                  </span>
                ) : (
                  <span>
                    This relation is not surjective as{" "}
                    {functionProperties.isSurjective?.counterexample}
                  </span>
                )}
              </div>
            </Tooltip>
          </p>
          <p>
            <a className="bijective">
              Bijective: {functionProperties.isBijective?.result ? "✔️" : "❌"}
            </a>
            <Tooltip
              className="hovering-text"
              anchorSelect=".bijective"
              offset={40}
              place="right"
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                Bijective states that the function is surjective and injective.
                <br />
                {functionProperties.isBijective?.result ? (
                  <span>
                    This function is bijective as it is both surjective and
                    injective.
                  </span>
                ) : (
                  <span> {functionProperties.isBijective?.counterexample}</span>
                )}
              </div>
            </Tooltip>
          </p>
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
                <center>{functionName} =</center>
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
