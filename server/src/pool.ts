import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER ?? "postgres",
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB_NAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "",
  port: Number(process.env.DB_PORT) || 5432,
});

export async function verifyConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL database");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    return false;
  }
}

export default pool;
