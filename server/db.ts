import { drizzle } from "drizzle-orm/neon-http";
import { neon, Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure Neon to use ws library for WebSocket
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Pool for session store with WebSocket support
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});
