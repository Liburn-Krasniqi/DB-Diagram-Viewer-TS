import dotenv from "dotenv";
import express, { Request, Response } from "express";
import pool, { verifyConnection } from "./pool";
import cors from 'cors';
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

const CONSTRAINTS_QUERY = `
  SELECT
    tc.table_name,
    tc.constraint_type,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column
  FROM information_schema.table_constraints tc
  LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
  WHERE tc.table_schema = 'public'
`;

app.get("/api/constraints", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(CONSTRAINTS_QUERY);
    res.json({ rows: result.rows });
  } catch (err) {
    console.error("Constraints query error:", err);
    res.status(500).json({ error: "Failed to fetch constraints" });
  }
});

// Full schema for diagram: tables with columns + relationships
const COLUMNS_QUERY = `
  SELECT table_name, column_name, data_type, ordinal_position
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position
`;

app.get("/api/schema", async (_req: Request, res: Response) => {
  try {
    const [columnsRes, constraintsRes] = await Promise.all([
      pool.query<{ table_name: string; column_name: string; data_type: string; ordinal_position: string }>(COLUMNS_QUERY),
      pool.query<{
        table_name: string;
        constraint_type: string;
        column_name: string | null;
        foreign_table: string | null;
        foreign_column: string | null;
      }>(CONSTRAINTS_QUERY),
    ]);

    const tablesMap = new Map<
      string,
      { name: string; columns: { name: string; type: string; isPrimaryKey: boolean; isForeignKey: boolean; foreignTable?: string; foreignColumn?: string }[] }
    >();

    for (const row of columnsRes.rows) {
      const tableName = row.table_name;
      if (!tablesMap.has(tableName)) {
        tablesMap.set(tableName, { name: tableName, columns: [] });
      }
      const table = tablesMap.get(tableName)!;
      table.columns.push({
        name: row.column_name,
        type: row.data_type,
        isPrimaryKey: false,
        isForeignKey: false,
      });
    }

    const relationships: { fromTable: string; fromColumn: string; toTable: string; toColumn: string }[] = [];

    for (const row of constraintsRes.rows) {
      const tableName = row.table_name;
      const col = row.column_name;
      const type = row.constraint_type;
      const foreignTable = row.foreign_table ?? undefined;
      const foreignColumn = row.foreign_column ?? undefined;

      const table = tablesMap.get(tableName);
      if (!table || !col) continue;

      const column = table.columns.find((c) => c.name === col);
      if (!column) continue;

      if (type === "PRIMARY KEY") {
        column.isPrimaryKey = true;
      } else if (type === "FOREIGN KEY" && foreignTable && foreignColumn) {
        column.isForeignKey = true;
        column.foreignTable = foreignTable;
        column.foreignColumn = foreignColumn;
        relationships.push({ fromTable: tableName, fromColumn: col, toTable: foreignTable, toColumn: foreignColumn });
      }
    }

    const tables = Array.from(tablesMap.values());
    res.json({ tables, relationships });
  } catch (err) {
    console.error("Schema query error:", err);
    res.status(500).json({ error: "Failed to fetch schema" });
  }
});

async function startServer(): Promise<void> {
  const dbOk = await verifyConnection();
  if (!dbOk) {
    console.warn(
      "⚠️  Server starting without database. Set DB_HOST=localhost (and other DB_* vars) in .env if running PostgreSQL locally."
    );
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
