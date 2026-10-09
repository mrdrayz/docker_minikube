import { useCallback, useEffect, useState } from "react"
import { tasksApi, type Task, type TaskStatus, type TasksApi } from "@/api"
import type { RunAction } from "@/shared/hooks"
import { toTaskInput } from "../lib"
import type { TaskDraft } from "../types"

export type TasksOptions = {
	run: RunAction
	onChange?: () => Promise<unknown>
	api?: TasksApi
}

export type TasksState = {
	tasks: Task[]
	isLoading: boolean
	create: (draft: TaskDraft) => Promise<Task>
	update: (task: Task, draft: TaskDraft) => Promise<Task>
	move: (task: Task, status: TaskStatus) => Promise<Task>
	remove: (task: Task) => Promise<void>
}

export function useTasks(
	projectId: number | null,
	{ run, onChange, api = tasksApi }: TasksOptions,
): TasksState {
	const [tasks, setTasks] = useState<Task[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		let isActual = true
		setTasks([])

		if (projectId === null) return undefined

		setIsLoading(true)
		run(async () => {
			const list = await api.listByProject(projectId)

			if (isActual) setTasks(list)
		}).finally(() => {
			if (isActual) setIsLoading(false)
		})

		return () => {
			isActual = false
		}
	}, [projectId, run, api])

	const refresh = useCallback(
		async (currentProjectId: number) => {
			const [list] = await Promise.all([
				api.listByProject(currentProjectId),
				onChange?.(),
			])
			setTasks(list)
		},
		[api, onChange],
	)

	const create = async (draft: TaskDraft) => {
		if (projectId === null) throw new Error("Проект не выбран")

		const task = await api.create({ ...draft, project_id: projectId })

		await refresh(projectId)

		return task
	}

	const update = async (task: Task, draft: TaskDraft) => {
		const updated = await api.update(task.id, {
			...draft,
			project_id: task.project_id,
		})

		await refresh(task.project_id)

		return updated
	}

	const move = async (task: Task, status: TaskStatus) => {
		const updated = await api.update(task.id, {
			...toTaskInput(task),
			status,
		})

		await refresh(task.project_id)

		return updated
	}

	const remove = async (task: Task) => {
		await api.remove(task.id)
		await refresh(task.project_id)
	}

	return { tasks, isLoading, create, update, move, remove }
}
