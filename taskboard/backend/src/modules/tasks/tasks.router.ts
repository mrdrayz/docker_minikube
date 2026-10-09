import { Router } from "express"
import { ensureFound, notFound } from "../../lib/errors"
import { parseId } from "../../lib/validation"
import { parseTaskFilters, parseTaskInput } from "./tasks.validation"
import type { TasksRepository } from "./tasks.types"

const NOT_FOUND = "Задача не найдена"

export function createTasksRouter(repository: TasksRepository): Router {
	const router = Router()

	router.get("/", async (req, res) => {
		res.json(await repository.findAll(parseTaskFilters(req.query)))
	})

	router.get("/:id", async (req, res) => {
		const task = await repository.findById(parseId(req.params.id))
		res.json(ensureFound(task, NOT_FOUND))
	})

	router.post("/", async (req, res) => {
		const task = await repository.create(parseTaskInput(req.body))
		res.status(201).json(task)
	})

	router.put("/:id", async (req, res) => {
		const task = await repository.update(
			parseId(req.params.id),
			parseTaskInput(req.body),
		)
		res.json(ensureFound(task, NOT_FOUND))
	})

	router.delete("/:id", async (req, res) => {
		const deleted = await repository.remove(parseId(req.params.id))
		
    if (!deleted) throw notFound(NOT_FOUND)
		
    res.status(204).end()
	})

	return router
}
