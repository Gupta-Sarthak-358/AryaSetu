import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite, type PgliteDatabase } from "drizzle-orm/pglite";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".pgdata");

type AnyDb = PgliteDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __aryasetuDb?: AnyDb;
  __aryasetuRaw?: (sql: string) => Promise<unknown>;
};

export function getDb(): AnyDb {
  if (!globalForDb.__aryasetuDb) {
    const url = process.env.DATABASE_URL;
    if (url && !process.env.VITEST) {
      const sql = neon(url);
      globalForDb.__aryasetuDb = drizzleNeon(sql, { schema });
      globalForDb.__aryasetuRaw = (statement: string) => sql.query(statement, []);
    } else {
      const client = process.env.VITEST ? new PGlite() : new PGlite(DATA_DIR);
      globalForDb.__aryasetuDb = drizzlePglite(client, { schema });
      globalForDb.__aryasetuRaw = (statement: string) => client.query(statement);
    }
  }
  return globalForDb.__aryasetuDb;
}

export async function execSql(statement: string): Promise<unknown> {
  getDb();
  return globalForDb.__aryasetuRaw!(statement);
}

export async function execDdl(ddl: string): Promise<void> {
  const statements = ddl.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
  for (const s of statements) {
    await execSql(s);
  }
}
