import type { Project } from "@/api"
import { Avatar, BoardIcon, SettingsIcon } from "@/shared/ui"
import styles from "./ProjectSidebar.module.css"

export type ProjectSidebarProps = {
	project: Project
	onOpenSettings: () => void
}

export function ProjectSidebar({
	project,
	onOpenSettings,
}: ProjectSidebarProps) {
	return (
		<aside className={styles.sidebar} aria-label="Навигация по проекту">
			<div className={styles.project}>
				<Avatar name={project.name} seed={project.id} size="lg" />
				<div className={styles.projectText}>
					<p className={styles.projectName} title={project.name}>
						{project.name}
					</p>
					<p className={styles.projectType}>Программный проект</p>
				</div>
			</div>

			<nav aria-label="Разделы проекта">
				<ul className={styles.menu}>
					<li>
						<span className={styles.item} aria-current="page">
							<BoardIcon />
							Доска
						</span>
					</li>
					<li>
						<button
							type="button"
							className={styles.item}
							onClick={onOpenSettings}
						>
							<SettingsIcon />
							Настройки проекта
						</button>
					</li>
				</ul>
			</nav>
		</aside>
	)
}
