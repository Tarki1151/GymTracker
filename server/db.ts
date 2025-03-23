import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// PostgreSQL bağlantı havuzu
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Drizzle ORM örneği
export const db = drizzle(pool, { schema });