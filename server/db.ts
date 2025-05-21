import { Pool } from 'pg';  // Use pg package for Supabase Postgres connection
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema'; 

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

// Create a pool using the Supabase Postgres URL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize drizzle ORM with the pool and your schema
export const db = drizzle(pool, { schema });
