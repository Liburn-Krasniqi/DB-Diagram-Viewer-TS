import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { TableNode } from './TableNode';
import type { DbSchema } from './types/schema';

const nodeTypes = {
  tableNode: TableNode,
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

/** Fetch database schema from API and return in diagram-ready format */
async function fetchSchema(): Promise<DbSchema> {
  const res = await fetch(`${API_BASE}/api/schema`);
  if (!res.ok) throw new Error(`Schema fetch failed: ${res.status}`);
  const json = await res.json();
  return { tables: json.tables ?? [], relationships: json.relationships ?? [] };
}

/** Build ReactFlow nodes and edges from saved schema (readable format for diagram view) */
function schemaToDiagram(schema: DbSchema): { nodes: Node[]; edges: Edge[] } {
  const NODE_WIDTH = 220;
  const NODE_HEIGHT = 40;
  const GAP_X = 80;
  const GAP_Y = 60;

  const nodes: Node[] = schema.tables.map((table, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return {
      id: table.name,
      type: 'tableNode',
      position: { x: col * (NODE_WIDTH + GAP_X), y: row * (NODE_HEIGHT * (table.columns.length + 1) + GAP_Y) },
      data: {
        tableName: table.name,
        columns: table.columns.map((c) => ({
          name: c.name,
          type: c.type,
          isPrimaryKey: c.isPrimaryKey,
          isForeignKey: c.isForeignKey,
        })),
      },
    };
  });

  const edges: Edge[] = schema.relationships.map((rel, i) => ({
    id: `e-${rel.fromTable}-${rel.fromColumn}-${rel.toTable}-${i}`,
    source: rel.fromTable,
    target: rel.toTable,
    sourceHandle: `${rel.fromColumn}-source`,
    targetHandle: `${rel.toColumn}-target`,
    animated: true,
  }));

  return { nodes, edges };
}

export default function App() {
  /** Database schema in readable format – saved for diagram view and later use */
  const [schema, setSchema] = useState<DbSchema | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    fetchSchema()
      .then((data) => {
        setSchema(data);
        setSchemaError(null);
        const { nodes: nextNodes, edges: nextEdges } = schemaToDiagram(data);
        setNodes(nextNodes);
        setEdges(nextEdges);
      })
      .catch((err) => {
        setSchemaError(err instanceof Error ? err.message : 'Failed to load schema');
        setSchema(null);
      });
  }, []);

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
      {schema && !schemaError && (
        <div style={{ position: 'absolute', top: 8, left: 8, padding: '4px 8px', background: '#1a3a1a', color: '#8f8', zIndex: 10, borderRadius: 4, fontSize: 12 }}>
          Schema: {schema.tables.length} tables, {schema.relationships.length} relationships
        </div>
      )}
      {schemaError && (
        <div style={{ position: 'absolute', top: 8, left: 8, right: 8, padding: 8, background: '#4a1a1a', color: '#f88', zIndex: 10, borderRadius: 4 }}>
          {schemaError}
        </div>
      )}
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
