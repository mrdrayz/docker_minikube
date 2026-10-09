import { Link } from "react-router"
import type { ProjectWithStats } from "@/api"
import { routes } from "@/shared/config"
import { getAccentColor } from "@/shared/lib"
import { Avatar } from "@/shared/ui"
import { getOpenTaskCount, getProgressPercent } from "../../lib"
import styles from "./ProjectCard.module.css"

export type ProjectCardProps = {
	project: ProjectWithStats
}

export function ProjectCard({ project }: ProjectCardProps) {
	const { soft } = getAccentColor(project.id)
	const progress = getProgressPercent(project)

	return (
		<article className={styles.card} style={{ borderLeftColor: soft }}>
			<div className={styles.header}>
				<Avatar name={project.name} seed={project.id} />
				<div className={styles.titleBox}>
					<h3 className={styles.title}>
						<Link
							to={routes.project(project.id)}
							className={styles.link}
							title={project.name}
						>
							{project.name}
						</Link>
					</h3>
					<p className={styles.description}>
						{project.description || "Без описания"}
					</p>
				</div>
			</div>

			<p className={styles.sectionTitle}>Задачи</p>
			<dl className={styles.stats}>
				<div className={styles.stat}>
					<dt>Открытые</dt>
					<dd className={styles.badge}>
						{getOpenTaskCount(project)}
					</dd>
				</div>
				<div className={styles.stat}>
					<dt>Выполненные</dt>
					<dd className={styles.badge}>{project.done_count}</dd>
				</div>
			</dl>

			<div className={styles.footer}>
				<div
					className={styles.progress}
					role="progressbar"
					aria-label="Прогресс проекта"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={progress}
				>
					<span
						className={styles.progressValue}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<span className={styles.progressText}>{progress}%</span>
			</div>
		</article>
	)
}
