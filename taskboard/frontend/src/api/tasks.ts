import { API_BASE_URL, request } from "./client"
import type { Task, TaskInput } from "./types"

const BASE_URL = `${API_BASE_URL}/tasks`

export const tasksApi = {
	listByProject: (projectId: number) =>
		request<Task[]>("GET", `${BASE_URL}?project_id=${projectId}`),
	create: (input: TaskInput) => request<Task>("POST", BASE_URL, input),
	update: (id: number, input: TaskInput) =>
		request<Task>("PUT", `${BASE_URL}/${id}`, input),
	remove: (id: number) => request<void>("DELETE", `${BASE_URL}/${id}`),
}

export type TasksApi = typeof tasksApi
