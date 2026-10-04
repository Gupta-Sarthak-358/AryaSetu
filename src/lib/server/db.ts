import { PGlite } from "@electric-sql/pglite";
import { drizzle, type PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".pgdata");

const globalForDb = globalThis as unknown as { __aryasetuDb?: PgliteDatabase<typeof schema> };

export function getDb(): PgliteDatabase<typeof schema> {
  if (!globalForDb.__aryasetuDb) {
    const client = new PGlite(DATA_DIR);
    globalForDb.__aryasetuDb = drizzle(client, { schema });
  }
  return globalForDb.__aryasetuDb;
}

export async function rawQuery(sql: string) {
  const db = getDb();
  return (db as unknown as { $client: PGlite }).$client.query(sql);
}
