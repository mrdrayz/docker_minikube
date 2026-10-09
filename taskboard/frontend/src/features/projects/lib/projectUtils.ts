import type { ProjectWithStats } from "@/api"
import { matchesQuery, normalizeQuery } from "@/shared/lib"

export function filterProjects(
	projects: ProjectWithStats[],
	query: string,
): ProjectWithStats[] {
	const normalized = normalizeQuery(query)
	return projects.filter((project) =>
		matchesQuery(normalized, project.name, project.description),
	)
}

export function getOpenTaskCount(project: ProjectWithStats): number {
	return project.task_count - project.done_count
}

export function getProgressPercent(project: ProjectWithStats): number {
	return project.task_count === 0
		? 0
		: Math.round((project.done_count / project.task_count) * 100)
}
