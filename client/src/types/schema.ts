/**
 * Database schema types – readable format for diagram view.
 * Fetched from GET /api/schema and used to build ReactFlow nodes/edges.
 */

export interface SchemaColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignTable?: string;
  foreignColumn?: string;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export interface SchemaRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

/** Full schema: tables + relationships, ready for diagram rendering */
export interface DbSchema {
  tables: SchemaTable[];
  relationships: SchemaRelationship[];
}
