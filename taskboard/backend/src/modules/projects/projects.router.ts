import { Router } from "express"
import { ensureFound, notFound } from "../../lib/errors"
import { parseId } from "../../lib/validation"
import { parseProjectInput } from "./projects.validation"
import type { ProjectsRepository } from "./projects.types"

const NOT_FOUND = "Проект не найден"

export function createProjectsRouter(repository: ProjectsRepository): Router {
	const router = Router()

	router.get("/", async (_req, res) => {
		res.json(await repository.findAll())
	})

	router.get("/:id", async (req, res) => {
		const project = await repository.findById(parseId(req.params.id))
		res.json(ensureFound(project, NOT_FOUND))
	})

	router.post("/", async (req, res) => {
		const project = await repository.create(parseProjectInput(req.body))
		res.status(201).json(project)
	})

	router.put("/:id", async (req, res) => {
		const project = await repository.update(
			parseId(req.params.id),
			parseProjectInput(req.body),
		)
		res.json(ensureFound(project, NOT_FOUND))
	})

	router.delete("/:id", async (req, res) => {
		const deleted = await repository.remove(parseId(req.params.id))

		if (!deleted) throw notFound(NOT_FOUND)

		res.status(204).end()
	})

	return router
}
