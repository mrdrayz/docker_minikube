import type { CrudRepository } from "../../lib/repository"

export type Project = {
	id: number
	name: string
	description: string
	created_at: Date
	updated_at: Date
}

export type ProjectWithStats = Project & {
	task_count: number
	done_count: number
}

export type ProjectInput = {
	name: string
	description: string
}

export interface ProjectsRepository extends CrudRepository<
	Project,
	ProjectInput
> {
	findAll(): Promise<ProjectWithStats[]>
}
