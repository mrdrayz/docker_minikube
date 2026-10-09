import type { CrudRepository } from "../../lib/repository"
import type { TASK_PRIORITIES, TASK_STATUSES } from "./tasks.constants"

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export type Task = {
	id: number
	project_id: number
	title: string
	description: string
	status: TaskStatus
	priority: TaskPriority
	due_date: string | null
	created_at: Date
	updated_at: Date
}

export type TaskInput = {
	projectId: number
	title: string
	description: string
	status: TaskStatus
	priority: TaskPriority
	dueDate: string | null
}

export type TaskFilters = {
	projectId?: number
	status?: TaskStatus
}

export interface TasksRepository extends CrudRepository<Task, TaskInput> {
	findAll(filters: TaskFilters): Promise<Task[]>
}
