import { Router } from "express"
import type { HealthDependencies } from "./health.types"

export function createHealthRouter({
	pingDatabase,
	isShuttingDown,
}: HealthDependencies): Router {
	const router = Router()

	router.get("/healthz", (_req, res) => {
		res.json({ status: "ok" })
	})

	router.get("/readyz", async (_req, res) => {
		if (isShuttingDown()) {
			res.status(503).json({ status: "shutting_down" })
			
      return
		}
    
		try {
			await pingDatabase()
			res.json({ status: "ready" })
		} catch {
			res.status(503).json({ status: "db_unavailable" })
		}
	})

	return router
}
