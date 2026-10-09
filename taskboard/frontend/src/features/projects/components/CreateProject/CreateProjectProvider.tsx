import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react"
import { useNavigate } from "react-router"
import type { ProjectInput } from "@/api"
import { routes } from "@/shared/config"
import { useProjects } from "../../model"
import { ProjectFormModal } from "../ProjectFormModal"

export type CreateProjectContextValue = {
	open: () => void
}

const CreateProjectContext = createContext<CreateProjectContextValue | null>(
	null,
)

export function CreateProjectProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false)
	const { create } = useProjects()
	const navigate = useNavigate()
	const value = useMemo<CreateProjectContextValue>(
		() => ({ open: () => setIsOpen(true) }),
		[],
	)

	async function handleSubmit(input: ProjectInput) {
		const project = await create(input)

		navigate(routes.project(project.id))
	}

	return (
		<CreateProjectContext.Provider value={value}>
			{children}
			<ProjectFormModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSubmit={handleSubmit}
			/>
		</CreateProjectContext.Provider>
	)
}

export function useCreateProject(): CreateProjectContextValue {
	const context = useContext(CreateProjectContext)

	if (!context) {
		throw new Error(
			"useCreateProject должен использоваться внутри CreateProjectProvider",
		)
	}

	return context
}
