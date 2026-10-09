import { API_BASE_URL, request } from "./client"
import type { Project, ProjectInput, ProjectWithStats } from "./types"

const BASE_URL = `${API_BASE_URL}/projects`

export const projectsApi = {
	list: () => request<ProjectWithStats[]>("GET", BASE_URL),
	create: (input: ProjectInput) => request<Project>("POST", BASE_URL, input),
	update: (id: number, input: ProjectInput) =>
		request<Project>("PUT", `${BASE_URL}/${id}`, input),
	remove: (id: number) => request<void>("DELETE", `${BASE_URL}/${id}`),
}

export type ProjectsApi = typeof projectsApi
