import { Link, NavLink } from "react-router"
import { ProjectSearch, useCreateProject } from "@/features/projects"
import { routes } from "@/shared/config"
import { cx } from "@/shared/lib"
import { Button, LogoIcon, PlusIcon } from "@/shared/ui"
import styles from "./TopNav.module.css"

export function TopNav() {
	const { open } = useCreateProject()

	return (
		<header className={styles.topNav}>
			<div className={styles.primary}>
				<Link
					to={routes.projects}
					className={styles.logo}
					aria-label="TBoard - все проекты"
				>
					<LogoIcon size={26} />
					<span>TBoard</span>
				</Link>
				<nav aria-label="Основная навигация">
					<NavLink
						to={routes.projects}
						className={({ isActive }) =>
							cx(styles.link, isActive && styles.active)
						}
					>
						Проекты
					</NavLink>
				</nav>
				<Button variant="primary" onClick={open}>
					<PlusIcon size={16} />
					<span>
						Создать<span className={styles.wideOnly}> проект</span>
					</span>
				</Button>
			</div>
			<ProjectSearch className={styles.search} />
		</header>
	)
}
