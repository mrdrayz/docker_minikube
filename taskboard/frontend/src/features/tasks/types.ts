import type { Task, TaskInput, TaskStatus } from "@/api"

export type TasksByStatus = Record<TaskStatus, Task[]>

export type TaskDraft = Omit<TaskInput, "project_id">
