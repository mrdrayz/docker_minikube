import express, { type Express } from "express"
import type { Logger } from "./lib/logger"
import {
	createRequestLogger,
	errorHandler,
	notFoundHandler,
} from "./middleware"
import {
	createHealthRouter,
	HEALTH_PATHS,
	type HealthDependencies,
} from "./modules/health"
import {
	createProjectsRouter,
	type ProjectsRepository,
} from "./modules/projects"
import { createTasksRouter, type TasksRepository } from "./modules/tasks"

const API_PREFIX = "/api/v1"

export type AppDependencies = {
	logger: Logger
	projectsRepository: ProjectsRepository
	tasksRepository: TasksRepository
	health: HealthDependencies
}

export function createApp(deps: AppDependencies): Express {
	const app = express()

	app.disable("x-powered-by")
	app.use(createRequestLogger(deps.logger, HEALTH_PATHS))
	app.use(express.json({ limit: "100kb" }))

	app.use(createHealthRouter(deps.health))
	app.use(
		`${API_PREFIX}/projects`,
		createProjectsRouter(deps.projectsRepository),
	)
	app.use(`${API_PREFIX}/tasks`, createTasksRouter(deps.tasksRepository))

	app.use(notFoundHandler)
	app.use(errorHandler)

	return app
}
