import fs from "node:fs"
import path from "node:path"
import type { PoolClient } from "pg"
import { loadConfig } from "../config"
import { createLogger, type Logger } from "../lib/logger"
import { listMigrationFiles, MIGRATIONS_DIR } from "./migrations"
import { createPool } from "./pool"

const LOCK_ID = 727274

async function ensureMigrationsTable(client: PoolClient): Promise<void> {
	await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

async function getAppliedMigrations(client: PoolClient): Promise<Set<string>> {
	const { rows } = await client.query<{ name: string }>(
		"SELECT name FROM schema_migrations",
	)

	return new Set(rows.map((row) => row.name))
}

async function applyMigration(
	client: PoolClient,
	file: string,
	logger: Logger,
): Promise<void> {
	const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8")
	
  await client.query("BEGIN")
	
  try {
		await client.query(sql)
		await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
			file,
		])
		await client.query("COMMIT")
		
    logger.info({ migration: file }, "Миграция применена")
	} catch (err) {
		await client.query("ROLLBACK")
		
    const reason = err instanceof Error ? err.message : String(err)
		
    throw new Error(`Миграция ${file} не применена: ${reason}`)
	}
}

async function migrate(client: PoolClient, logger: Logger): Promise<void> {
	await client.query("SELECT pg_advisory_lock($1)", [LOCK_ID])
	
  try {
		await ensureMigrationsTable(client)
		
    const applied = await getAppliedMigrations(client)
		const pending = listMigrationFiles().filter(
			(file) => !applied.has(file),
		)

		for (const file of pending) {
			await applyMigration(client, file, logger)
		}

		logger.info(
			{ applied: pending.length, total: applied.size + pending.length },
			"Миграции завершены",
		)
	} finally {
		await client
			.query("SELECT pg_advisory_unlock($1)", [LOCK_ID])
			.catch(() => undefined)
	}
}

async function main(): Promise<void> {
	const config = loadConfig()
	const logger = createLogger(config.logLevel)
	const pool = createPool(config.db, logger)

	try {
		const client = await pool.connect()
		
    try {
			await migrate(client, logger)
		} finally {
			client.release()
		}
	} catch (err) {
		logger.error({ err }, "Ошибка миграции")
		process.exitCode = 1
	} finally {
		await pool.end()
	}
}

main().catch((err: unknown) => {
	console.error(err instanceof Error ? err.message : err)
	process.exitCode = 1
})
