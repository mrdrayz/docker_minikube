import { Outlet } from "react-router"
import { useProjects } from "@/features/projects"
import { ErrorBanner } from "@/shared/ui"
import { TopNav } from "../TopNav"
import styles from "./AppLayout.module.css"

export function AppLayout() {
	const { loadError, reload } = useProjects()

	return (
		<div className={styles.app}>
			<TopNav />
			{loadError && (
				<div className={styles.banner}>
					<ErrorBanner
						message={loadError}
						onClose={() => void reload()}
						closeLabel="Повторить"
					/>
				</div>
			)}
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	)
}
