import type { Pool } from "pg"
import { loadConfig } from "../config"
import { createLogger } from "../lib/logger"
import { listMigrationFiles } from "./migrations"
import { createPool } from "./pool"

const RETRY_DELAY_MS = 2000
const TIMEOUT_MS = 5 * 60 * 1000

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

async function findPendingMigrations(pool: Pool): Promise<string[]> {
	const { rows } = await pool.query<{ name: string }>(
		"SELECT name FROM schema_migrations",
	)
	const applied = new Set(rows.map((row) => row.name))

	return listMigrationFiles().filter((file) => !applied.has(file))
}

async function main(): Promise<void> {
	const config = loadConfig()
	const logger = createLogger(config.logLevel)
	const pool = createPool(config.db, logger)
	const deadline = Date.now() + TIMEOUT_MS

	try {
		while (Date.now() < deadline) {
			try {
				const pending = await findPendingMigrations(pool)

				if (pending.length === 0) {
					logger.info("Все миграции применены")

					return
				}

				logger.info({ pending }, "Ждём применения миграций")
			} catch (err) {
				const reason = err instanceof Error ? err.message : String(err)

				logger.info({ reason }, "Ждём базу данных и таблицу миграций")
			}

			await sleep(RETRY_DELAY_MS)
		}

		throw new Error("Миграции не применены за отведённое время")
	} finally {
		await pool.end()
	}
}

main().catch((err: unknown) => {
	console.error(err instanceof Error ? err.message : err)
	process.exitCode = 1
})
