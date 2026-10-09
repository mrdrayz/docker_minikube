export type ClassValue = string | false | null | undefined

export function cx(...classNames: ClassValue[]): string {
	return classNames.filter(Boolean).join(" ")
}
