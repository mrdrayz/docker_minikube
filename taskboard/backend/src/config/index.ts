export type DbConfig = {
	host: string
	port: number
	database: string
	user: string
	password: string
	maxConnections: number
}

export type AppConfig = {
	port: number
	logLevel: string
	shutdownTimeoutSec: number
	db: DbConfig
}

type Env = NodeJS.ProcessEnv

function readRequired(env: Env, name: string): string {
	const value = env[name]

	if (value === undefined || value === "") {
		throw new Error(`Не задана обязательная переменная окружения ${name}`)
	}

	return value
}

function readOptional(env: Env, name: string, defaultValue: string): string {
	const value = env[name]

	return value === undefined || value === "" ? defaultValue : value
}

function readNumber(env: Env, name: string, defaultValue: number): number {
	const raw = readOptional(env, name, String(defaultValue))
	const value = Number(raw)

	if (!Number.isFinite(value) || value <= 0) {
		throw new Error(
			`Переменная окружения ${name} должна быть положительным числом, получено: ${raw}`,
		)
	}

	return value
}

export function loadConfig(env: Env = process.env): AppConfig {
	return {
		port: readNumber(env, "PORT", 3000),
		logLevel: readOptional(env, "LOG_LEVEL", "info"),
		shutdownTimeoutSec: readNumber(env, "SHUTDOWN_TIMEOUT_SEC", 10),
		db: {
			host: readRequired(env, "DB_HOST"),
			port: readNumber(env, "DB_PORT", 5432),
			database: readRequired(env, "DB_NAME"),
			user: readRequired(env, "DB_USER"),
			password: readRequired(env, "DB_PASSWORD"),
			maxConnections: readNumber(env, "DB_POOL_MAX", 10),
		},
	}
}
