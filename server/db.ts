import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pkg;

// PostgreSQL bağlantı havuzu
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Drizzle ORM örneği
export const db = drizzle(pool, { schema });