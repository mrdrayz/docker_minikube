import type { TaskPriority, TaskStatus } from "@/api"
import type { LozengeTone, SelectOption } from "@/shared/ui"

export type StatusMeta = {
	id: TaskStatus
	title: string
}

export const TASK_STATUSES: readonly StatusMeta[] = [
	{ id: "todo", title: "К выполнению" },
	{ id: "in_progress", title: "В работе" },
	{ id: "done", title: "Готово" },
]

export const STATUS_OPTIONS: readonly SelectOption<TaskStatus>[] =
	TASK_STATUSES.map((status) => ({
		value: status.id,
		label: status.title,
	}))

export const PRIORITY_OPTIONS: readonly SelectOption<TaskPriority>[] = [
	{ value: "low", label: "Низкий" },
	{ value: "medium", label: "Средний" },
	{ value: "high", label: "Высокий" },
]

export const PRIORITY_TONES: Record<TaskPriority, LozengeTone> = {
	low: "success",
	medium: "warning",
	high: "danger",
}

export const DEFAULT_STATUS: TaskStatus = "todo"
export const DEFAULT_PRIORITY: TaskPriority = "medium"
export const TASK_TITLE_MAX = 200
export const TASK_DESCRIPTION_MAX = 2000
