import { Pool, types } from "pg"
import type { DbConfig } from "../config"
import type { Logger } from "../lib/logger"

const PG_DATE_OID = 1082
types.setTypeParser(PG_DATE_OID, (value: string) => value)

export function createPool(dbConfig: DbConfig, logger: Logger): Pool {
	const pool = new Pool({
		host: dbConfig.host,
		port: dbConfig.port,
		database: dbConfig.database,
		user: dbConfig.user,
		password: dbConfig.password,
		max: dbConfig.maxConnections,
		connectionTimeoutMillis: 5000,
	})

	pool.on("error", (err) => {
		logger.error({ err }, "Ошибка соединения с PostgreSQL")
	})

	return pool
}
