import pino, { type Logger } from "pino"
import { toSafeError } from "./safeError"

export type { Logger }

export function createLogger(level: string): Logger {
	return pino({
		level,
		redact: ["password", "*.password", "req.headers.authorization"],
		serializers: {
			err: toSafeError,
		},
	})
}
