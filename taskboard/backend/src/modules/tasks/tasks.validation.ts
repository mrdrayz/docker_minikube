import {
	asRecord,
	oneOf,
	optionalDate,
	optionalString,
	parseId,
	requiredString,
} from "../../lib/validation"
import {
	DEFAULT_TASK_PRIORITY,
	DEFAULT_TASK_STATUS,
	TASK_DESCRIPTION_MAX,
	TASK_PRIORITIES,
	TASK_STATUSES,
	TASK_TITLE_MAX,
} from "./tasks.constants"
import type { TaskFilters, TaskInput } from "./tasks.types"

const INVALID_PROJECT_ID = "Некорректный project_id"

export function parseTaskInput(body: unknown): TaskInput {
	const data = asRecord(body)

	return {
		projectId: parseId(data.project_id, INVALID_PROJECT_ID),
		title: requiredString(data.title, {
			max: TASK_TITLE_MAX,
			message: `Название задачи должно быть от 1 до ${TASK_TITLE_MAX} символов`,
		}),
		description: optionalString(data.description, {
			max: TASK_DESCRIPTION_MAX,
			message: `Описание не должно быть длиннее ${TASK_DESCRIPTION_MAX} символов`,
		}),
		status: oneOf(data.status, TASK_STATUSES, {
			defaultValue: DEFAULT_TASK_STATUS,
			message: `Статус должен быть одним из: ${TASK_STATUSES.join(", ")}`,
		}),
		priority: oneOf(data.priority, TASK_PRIORITIES, {
			defaultValue: DEFAULT_TASK_PRIORITY,
			message: `Приоритет должен быть одним из: ${TASK_PRIORITIES.join(", ")}`,
		}),
		dueDate: optionalDate(data.due_date, {
			message: "Срок должен быть корректной датой в формате ГГГГ-ММ-ДД",
		}),
	}
}

export function parseTaskFilters(query: unknown): TaskFilters {
	const data = asRecord(query)
	const filters: TaskFilters = {}

	if (data.project_id !== undefined) {
		filters.projectId = parseId(data.project_id, INVALID_PROJECT_ID)
	}

	if (data.status !== undefined) {
		filters.status = oneOf(data.status, TASK_STATUSES, {
			message: "Неизвестный статус",
		})
	}

	return filters
}
