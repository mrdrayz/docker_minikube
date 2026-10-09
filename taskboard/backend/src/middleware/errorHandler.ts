import type { ErrorRequestHandler } from "express"
import { HttpError } from "../lib/errors"

const PG_FOREIGN_KEY_VIOLATION = "23503"

function hasProperty<K extends string>(
	value: unknown,
	key: K,
): value is Record<K, unknown> {
	return typeof value === "object" && value !== null && key in value
}

export const errorHandler: ErrorRequestHandler = (
	err: unknown,
	req,
	res,
	next,
) => {
	if (res.headersSent) {
		next(err)
		
    return
	}

	if (err instanceof HttpError) {
		res.status(err.status).json({ error: err.message })
		
    return
	}

	if (hasProperty(err, "type") && err.type === "entity.parse.failed") {
		res.status(400).json({ error: "Некорректный JSON в теле запроса" })
		
    return
	}

	if (hasProperty(err, "code") && err.code === PG_FOREIGN_KEY_VIOLATION) {
		res.status(400).json({ error: "Указанный проект не существует" })
		
    return
	}

	req.log.error({ err }, "Необработанная ошибка")
	res.status(500).json({ error: "Внутренняя ошибка сервера" })
}
