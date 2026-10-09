export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export type Project = {
	id: number
	name: string
	description: string
	created_at: string
	updated_at: string
}

export type ProjectWithStats = Project & {
	task_count: number
	done_count: number
}

export type ProjectInput = {
	name: string
	description: string
}

export type Task = {
	id: number
	project_id: number
	title: string
	description: string
	status: TaskStatus
	priority: TaskPriority
	due_date: string | null
	created_at: string
	updated_at: string
}

export type TaskInput = {
	project_id: number
	title: string
	description: string
	status: TaskStatus
	priority: TaskPriority
	due_date: string | null
}
