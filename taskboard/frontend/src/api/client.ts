type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

const NO_CONNECTION = "Нет связи с сервером. Проверьте, что бэкенд запущен."

function readErrorMessage(data: unknown): string | undefined {
	if (
		typeof data === "object" &&
		data !== null &&
		"error" in data &&
		typeof data.error === "string"
	) {
		return data.error
	}

	return undefined
}

export async function request<T>(
	method: HttpMethod,
	url: string,
	body?: unknown,
): Promise<T> {
	let response: Response

	try {
		response = await fetch(url, {
			method,
			headers:
				body === undefined
					? undefined
					: { "Content-Type": "application/json" },
			body: body === undefined ? undefined : JSON.stringify(body),
		})
	} catch {
		throw new Error(NO_CONNECTION)
	}

	if (response.status === 204) return undefined as T

	const data: unknown = await response.json().catch(() => null)

	if (!response.ok) {
		throw new Error(
			readErrorMessage(data) ??
				`${NO_CONNECTION} (код ответа ${response.status})`,
		)
	}

	return data as T
}
