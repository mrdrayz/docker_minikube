import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react"
import {
	projectsApi,
	type Project,
	type ProjectInput,
	type ProjectsApi,
	type ProjectWithStats,
} from "@/api"

export type ProjectsContextValue = {
	items: ProjectWithStats[]
	isLoading: boolean
	loadError: string
	reload: () => Promise<void>
	findById: (id: number) => ProjectWithStats | undefined
	create: (input: ProjectInput) => Promise<Project>
	update: (id: number, input: ProjectInput) => Promise<Project>
	remove: (id: number) => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export type ProjectsProviderProps = {
	children: ReactNode
	api?: ProjectsApi
}

export function ProjectsProvider({
	children,
	api = projectsApi,
}: ProjectsProviderProps) {
	const [items, setItems] = useState<ProjectWithStats[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState("")

	const reload = useCallback(async () => {
		try {
			setItems(await api.list())
			setLoadError("")
		} catch (err) {
			setLoadError(err instanceof Error ? err.message : String(err))
		}
	}, [api])

	useEffect(() => {
		reload().finally(() => setIsLoading(false))
	}, [reload])

	const value = useMemo<ProjectsContextValue>(
		() => ({
			items,
			isLoading,
			loadError,
			reload,
			findById: (id) => items.find((project) => project.id === id),
			create: async (input) => {
				const project = await api.create(input)
				await reload()
				return project
			},
			update: async (id, input) => {
				const project = await api.update(id, input)
				await reload()
				return project
			},
			remove: async (id) => {
				await api.remove(id)
				await reload()
			},
		}),
		[items, isLoading, loadError, reload, api],
	)

	return (
		<ProjectsContext.Provider value={value}>
			{children}
		</ProjectsContext.Provider>
	)
}

export function useProjects(): ProjectsContextValue {
	const context = useContext(ProjectsContext)

	if (!context) {
		throw new Error(
			"useProjects должен использоваться внутри ProjectsProvider",
		)
	}

	return context
}
