export class HttpError extends Error {
	readonly status: number

	constructor(status: number, message: string) {
		super(message)
		this.name = "HttpError"
		this.status = status
	}
}

export function badRequest(message: string): HttpError {
	return new HttpError(400, message)
}

export function notFound(message: string): HttpError {
	return new HttpError(404, message)
}

export function ensureFound<T>(
	value: T | null | undefined,
	message: string,
): T {
	if (value === null || value === undefined) throw notFound(message)
	
    return value
}
