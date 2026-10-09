import type { Database } from "../../db/types"
import type {
	Project,
	ProjectInput,
	ProjectWithStats,
	ProjectsRepository,
} from "./projects.types"

export function createProjectsRepository(db: Database): ProjectsRepository {
	return {
		async findAll() {
			const { rows } = await db.query<ProjectWithStats>(`
        SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
               COUNT(t.id)::int                                   AS task_count,
               COUNT(t.id) FILTER (WHERE t.status = 'done')::int  AS done_count
        FROM projects p
        LEFT JOIN tasks t ON t.project_id = p.id
        GROUP BY p.id
        ORDER BY p.created_at
      `)

			return rows
		},

		async findById(id: number) {
			const { rows } = await db.query<Project>(
				"SELECT * FROM projects WHERE id = $1",
				[id],
			)

			return rows[0] ?? null
		},

		async create({ name, description }: ProjectInput) {
			const { rows } = await db.query<Project>(
				"INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
				[name, description],
			)

			return rows[0]!
		},

		async update(id: number, { name, description }: ProjectInput) {
			const { rows } = await db.query<Project>(
				`UPDATE projects
         SET name = $1, description = $2, updated_at = now()
         WHERE id = $3
         RETURNING *`,
				[name, description, id],
			)

			return rows[0] ?? null
		},

		async remove(id: number) {
			const { rowCount } = await db.query(
				"DELETE FROM projects WHERE id = $1",
				[id],
			)
      
			return (rowCount ?? 0) > 0
		},
	}
}
