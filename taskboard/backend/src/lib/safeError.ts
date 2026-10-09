export type SafeError = {
	type: string
	code?: string
	message?: string
	stack?: string
}

type DatabaseErrorLike = Error & { code: string; severity: string }

const SQLSTATE_PATTERN = /^[0-9A-Z]{5}$/

function isDatabaseError(err: unknown): err is DatabaseErrorLike {
	return (
		err instanceof Error &&
		"severity" in err &&
		"code" in err &&
		typeof err.code === "string" &&
		SQLSTATE_PATTERN.test(err.code)
	)
}

function readCode(err: Error): string | undefined {
	return "code" in err && typeof err.code === "string" ? err.code : undefined
}

export function toSafeError(err: unknown): SafeError {
	if (isDatabaseError(err)) {
		return { type: "DatabaseError", code: err.code }
	}

	if (err instanceof Error) {
		return {
			type: err.name,
			code: readCode(err),
			message: err.message,
			stack: err.stack,
		}
	}

	return { type: typeof err }
}

export function describeError(err: unknown): string {
	if (isDatabaseError(err)) {
		return `ошибка PostgreSQL с кодом ${err.code}`
	}

	return err instanceof Error ? err.message : String(err)
}
