import type { Task, TaskInput, TaskPriority, TaskStatus } from "@/api"
import { matchesQuery, normalizeQuery, todayIso } from "@/shared/lib"
import { PRIORITY_OPTIONS, TASK_STATUSES, type StatusMeta } from "../constants"
import type { TasksByStatus } from "../types"

export function getPriorityLabel(priority: TaskPriority): string {
	return (
		PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ??
		priority
	)
}

export function isTaskOverdue(task: Task): boolean {
	return (
		task.due_date !== null &&
		task.status !== "done" &&
		task.due_date < todayIso()
	)
}

export function filterTasks(tasks: Task[], query: string): Task[] {
	const normalized = normalizeQuery(query)

	return tasks.filter((task) =>
		matchesQuery(normalized, task.title, task.description),
	)
}

export function groupTasksByStatus(tasks: Task[]): TasksByStatus {
	const groups: TasksByStatus = { todo: [], in_progress: [], done: [] }

	for (const task of tasks) {
		groups[task.status].push(task)
	}

	return groups
}

export function getAdjacentStatuses(statusId: TaskStatus): {
	prev: StatusMeta | null
	next: StatusMeta | null
} {
	const index = TASK_STATUSES.findIndex((status) => status.id === statusId)
  
	return {
		prev: TASK_STATUSES[index - 1] ?? null,
		next: TASK_STATUSES[index + 1] ?? null,
	}
}

export function toTaskInput(task: Task): TaskInput {
	return {
		project_id: task.project_id,
		title: task.title,
		description: task.description,
		status: task.status,
		priority: task.priority,
		due_date: task.due_date,
	}
}
