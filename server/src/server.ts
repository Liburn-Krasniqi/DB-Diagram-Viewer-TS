import dotenv from "dotenv";
import express, { Request, Response } from "express";
import pool, { verifyConnection } from "./pool";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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
