export function normalizeQuery(query: string): string {
	return query.trim().toLocaleLowerCase("ru")
}

export function matchesQuery(
	normalizedQuery: string,
	...fields: string[]
): boolean {
	if (!normalizedQuery) return true
  
	return fields.some((field) =>
		field.toLocaleLowerCase("ru").includes(normalizedQuery),
	)
}
