import { ProjectCard, useCreateProject, useProjects } from "@/features/projects"
import { useDocumentTitle } from "@/shared/hooks"
import { Button, EmptyState, PlusIcon } from "@/shared/ui"
import styles from "./ProjectsPage.module.css"

export function ProjectsPage() {
	useDocumentTitle("Проекты")
	const { items, isLoading } = useProjects()
	const { open } = useCreateProject()

	function renderContent() {
		if (isLoading) {
			return (
				<p className={styles.status} role="status">
					Загружаем проекты…
				</p>
			)
		}

		if (items.length === 0) {
			return (
				<EmptyState
					title="Проектов пока нет"
					description="Создайте первый проект, чтобы вести в нём задачи на доске."
					action={
						<Button variant="primary" onClick={open}>
							<PlusIcon />
							Создать проект
						</Button>
					}
				/>
			)
		}

		return (
			<section aria-labelledby="all-projects">
				<h2 id="all-projects" className={styles.sectionTitle}>
					Все проекты{" "}
					<span className={styles.count}>{items.length}</span>
				</h2>
				<ul className={styles.grid}>
					{items.map((project) => (
						<li key={project.id} className={styles.item}>
							<ProjectCard project={project} />
						</li>
					))}
				</ul>
			</section>
		)
	}

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>Проекты</h1>
				{items.length > 0 && (
					<Button variant="primary" onClick={open}>
						<PlusIcon />
						Создать проект
					</Button>
				)}
			</header>
			<div className={styles.content}>{renderContent()}</div>
		</div>
	)
}
