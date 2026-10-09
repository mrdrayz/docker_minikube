import type { ReactNode } from "react"
import styles from "./EmptyState.module.css"

export type EmptyStateProps = {
	title: string
	description?: string
	headingLevel?: 1 | 2 | 3
	action?: ReactNode
}

export function EmptyState({
	title,
	description,
	headingLevel = 2,
	action,
}: EmptyStateProps) {
	const Heading = `h${headingLevel}` as const

	return (
		<section className={styles.empty}>
			<Heading className={styles.title}>{title}</Heading>
			{description && <p className={styles.description}>{description}</p>}
			{action && <div className={styles.action}>{action}</div>}
		</section>
	)
}
