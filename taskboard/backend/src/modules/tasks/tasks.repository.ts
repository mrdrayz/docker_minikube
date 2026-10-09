import type { Database } from "../../db/types"
import type {
	Task,
	TaskFilters,
	TaskInput,
	TasksRepository,
} from "./tasks.types"

function toParams(input: TaskInput): unknown[] {
	return [
		input.projectId,
		input.title,
		input.description,
		input.status,
		input.priority,
		input.dueDate,
	]
}

export function createTasksRepository(db: Database): TasksRepository {
	return {
		async findAll({ projectId, status }: TaskFilters) {
			const conditions: string[] = []
			const params: unknown[] = []

			if (projectId !== undefined) {
				params.push(projectId)
				conditions.push(`project_id = $${params.length}`)
			}

			if (status !== undefined) {
				params.push(status)
				conditions.push(`status = $${params.length}`)
			}

			const where =
				conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
			const { rows } = await db.query<Task>(
				`SELECT * FROM tasks ${where} ORDER BY created_at DESC`,
				params,
			)

			return rows
		},

		async findById(id: number) {
			const { rows } = await db.query<Task>(
				"SELECT * FROM tasks WHERE id = $1",
				[id],
			)

			return rows[0] ?? null
		},

		async create(input: TaskInput) {
			const { rows } = await db.query<Task>(
				`INSERT INTO tasks (project_id, title, description, status, priority, due_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
				toParams(input),
			)

			return rows[0]!
		},

		async update(id: number, input: TaskInput) {
			const { rows } = await db.query<Task>(
				`UPDATE tasks
         SET project_id = $1, title = $2, description = $3,
             status = $4, priority = $5, due_date = $6, updated_at = now()
         WHERE id = $7
         RETURNING *`,
				[...toParams(input), id],
			)

			return rows[0] ?? null
		},

		async remove(id: number) {
			const { rowCount } = await db.query(
				"DELETE FROM tasks WHERE id = $1",
				[id],
			)

			return (rowCount ?? 0) > 0
		},
	}
}
