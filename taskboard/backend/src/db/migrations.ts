import fs from "node:fs"
import path from "node:path"

export const MIGRATIONS_DIR = path.join(__dirname, "..", "..", "migrations")

export function listMigrationFiles(): string[] {
	return fs
		.readdirSync(MIGRATIONS_DIR)
		.filter((file) => file.endsWith(".sql"))
		.sort()
}
