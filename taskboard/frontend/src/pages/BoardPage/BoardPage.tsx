import { useParams } from "react-router"
import { useProjects } from "@/features/projects"
import { NotFoundPage } from "../NotFoundPage"
import { ProjectBoard } from "./ProjectBoard"
import styles from "./BoardPage.module.css"

function parseProjectId(value: string | undefined): number | null {
	const id = Number(value)
  
	return Number.isInteger(id) && id > 0 ? id : null
}

export function BoardPage() {
	const { projectId } = useParams()
	const { findById, isLoading } = useProjects()
	const id = parseProjectId(projectId)
	const project = id === null ? undefined : findById(id)

	if (isLoading) {
		return (
			<p className={styles.status} role="status">
				Загружаем проект…
			</p>
		)
	}

	if (!project) {
		return (
			<NotFoundPage
				title="Проект не найден"
				description="Проект был удалён или ссылка неверна. Выберите проект из списка."
			/>
		)
	}

	return <ProjectBoard key={project.id} project={project} />
}
