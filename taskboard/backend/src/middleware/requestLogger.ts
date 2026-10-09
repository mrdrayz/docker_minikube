import type { IncomingMessage, ServerResponse } from "node:http"
import { pinoHttp } from "pino-http"
import type { Logger } from "../lib/logger"
import { toSafeError } from "../lib/safeError"

function getLogLevel(_req: IncomingMessage, res: ServerResponse, err?: Error) {
	if (err || res.statusCode >= 500) return "error"
	
  if (res.statusCode >= 400) return "warn"
	
  return "info"
}

export function createRequestLogger(
	logger: Logger,
	ignoredPaths: readonly string[],
) {
	return pinoHttp({
		logger,
		autoLogging: { ignore: (req) => ignoredPaths.includes(req.url ?? "") },
		customLogLevel: getLogLevel,
		serializers: {
			err: toSafeError,
			req: (req: { id: unknown; method: string; url: string }) => ({
				id: req.id,
				method: req.method,
				url: req.url,
			}),
			res: (res: { statusCode: number }) => ({
				statusCode: res.statusCode,
			}),
		},
	})
}
