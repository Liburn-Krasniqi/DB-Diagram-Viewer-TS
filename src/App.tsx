import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { TableNode } from './TableNode';

const nodeTypes = {
  tableNode: TableNode,
};

const initialNodes: Node[] = [
  {
    id: 'publishers',
    type: 'tableNode',
    position: { x: 50, y: 50 },
    data: {
      tableName: 'publishers',
      columns: [
        { name: 'pub_id', type: 'int', isPrimaryKey: true },
        { name: 'pub_name', type: 'varchar' },
        { name: 'city', type: 'varchar' },
        { name: 'state', type: 'char' },
        { name: 'country', type: 'varchar' },
      ],
    },
  },
  {
    id: 'employee',
    type: 'tableNode',
    position: { x: 350, y: 50 },
    data: {
      tableName: 'employee',
      columns: [
        { name: 'emp_id', type: 'int', isPrimaryKey: true },
        { name: 'fname', type: 'varchar' },
        { name: 'minit', type: 'char' },
        { name: 'lname', type: 'varchar' },
        { name: 'job_id', type: 'int', isForeignKey: true },
        { name: 'job_lvl', type: 'tinyint' },
        { name: 'pub_id', type: 'int', isForeignKey: true },
        { name: 'hire_date', type: 'datetime' },
      ],
    },
  },
  {
    id: 'titles',
    type: 'tableNode',
    position: { x: 50, y: 300 },
    data: {
      tableName: 'titles',
      columns: [
        { name: 'title_id', type: 'int', isPrimaryKey: true },
        { name: 'title', type: 'varchar' },
        { name: 'type', type: 'char' },
        { name: 'pub_id', type: 'int', isForeignKey: true },
        { name: 'price', type: 'money' },
        { name: 'advance', type: 'money' },
        { name: 'royalty', type: 'int' },
        { name: 'ytd_sales', type: 'int' },
        { name: 'notes', type: 'varchar' },
        { name: 'pubdate', type: 'datetime' },
      ],
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'publishers', target: 'employee', sourceHandle: 'pub_id-source', targetHandle: 'pub_id-target', animated: true },
  { id: 'e2', source: 'publishers', target: 'titles', sourceHandle: 'pub_id-source', targetHandle: 'pub_id-target', animated: true },
  // { id: 'e3', source: 'stores', target: 'discounts', sourceHandle: 'source', targetHandle: 'target', animated: true },
  // { id: 'e4', source: 'stores', target: 'sales', sourceHandle: 'source', targetHandle: 'target', animated: true },
  // { id: 'e5', source: 'titles', target: 'sales', sourceHandle: 'source', targetHandle: 'target', animated: true },
];

export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background
          id="1"
          gap={10}
          color="#f1f1f1"
          bgColor='#131313'
          variant={BackgroundVariant.Lines}
        />
        <Background
          id="2"
          gap={100}
          color="#ccc"
          bgColor='#787878'
          variant={BackgroundVariant.Lines}
        />
        <Controls />
        <MiniMap nodeStrokeWidth={2} />
      </ReactFlow>
    </div>
  );
}