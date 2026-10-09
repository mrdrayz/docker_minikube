import { badRequest } from "./errors"

type StringRule = { max: number; message: string }

export function asRecord(value: unknown): Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {}
}

export function parseId(value: unknown, message = "Некорректный id"): number {
	const id = Number(value)

	if (!Number.isInteger(id) || id <= 0) throw badRequest(message)

	return id
}

function toTrimmedString(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

export function requiredString(
	value: unknown,
	{ max, message }: StringRule,
): string {
	const text = toTrimmedString(value)

	if (text.length < 1 || text.length > max) throw badRequest(message)

	return text
}

export function optionalString(
	value: unknown,
	{ max, message }: StringRule,
): string {
	const text = toTrimmedString(value)

	if (text.length > max) throw badRequest(message)

	return text
}

export function isOneOf<T extends string>(
	value: unknown,
	allowed: readonly T[],
): value is T {
	return (
		typeof value === "string" &&
		(allowed as readonly string[]).includes(value)
	)
}

export function oneOf<T extends string>(
	value: unknown,
	allowed: readonly T[],
	{ defaultValue, message }: { defaultValue?: T; message: string },
): T {
	const result = value ?? defaultValue

	if (!isOneOf(result, allowed)) throw badRequest(message)

	return result
}

function isValidIsoDate(value: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

	const date = new Date(`${value}T00:00:00Z`)

	return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

export function optionalDate(
	value: unknown,
	{ message }: { message: string },
): string | null {
	if (value === undefined || value === null || value === "") return null

	if (typeof value !== "string" || !isValidIsoDate(value))
		throw badRequest(message)

	return value
}
