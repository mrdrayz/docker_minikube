import type { Server } from "node:http"
import type { Pool } from "pg"
import { createApp } from "./app"
import { loadConfig, type AppConfig } from "./config"
import { createPool } from "./db/pool"
import { createLogger, type Logger } from "./lib/logger"
import { createProjectsRepository } from "./modules/projects"
import { createTasksRepository } from "./modules/tasks"

function setupGracefulShutdown(
	server: Server,
	pool: Pool,
	logger: Logger,
	config: AppConfig,
	markShuttingDown: () => void,
): void {
	let isStopping = false

	const shutdown = (signal: NodeJS.Signals) => {
		if (isStopping) return

		isStopping = true
    
		logger.info({ signal }, "Получен сигнал, завершаем работу")
		markShuttingDown()

		const forceExit = setTimeout(() => {
			logger.error("Не успели завершиться вовремя, выходим принудительно")
			process.exit(1)
		}, config.shutdownTimeoutSec * 1000)
		forceExit.unref()

		server.close(async () => {
			await pool.end()
			logger.info("Работа завершена корректно")
			process.exit(0)
		})
		server.closeIdleConnections()
	}

	process.on("SIGTERM", shutdown)
	process.on("SIGINT", shutdown)
}

function main(): void {
	const config = loadConfig()
	const logger = createLogger(config.logLevel)
	const pool = createPool(config.db, logger)
	let shuttingDown = false

	const app = createApp({
		logger,
		projectsRepository: createProjectsRepository(pool),
		tasksRepository: createTasksRepository(pool),
		health: {
			pingDatabase: () => pool.query("SELECT 1"),
			isShuttingDown: () => shuttingDown,
		},
	})

	const server = app.listen(config.port, () => {
		logger.info({ port: config.port }, "Сервер запущен")
	})

	setupGracefulShutdown(server, pool, logger, config, () => {
		shuttingDown = true
	})
}

try {
	main()
} catch (err) {
	console.error(err instanceof Error ? err.message : err)
	process.exitCode = 1
}
