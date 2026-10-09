export const routes = {
	home: "/",
	projects: "/projects",
	projectPattern: "/projects/:projectId",
	project: (id: number) => `/projects/${id}`,
} as const
