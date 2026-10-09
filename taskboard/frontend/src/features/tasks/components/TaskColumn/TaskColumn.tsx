import type { Task, TaskStatus } from "@/api"
import { cx } from "@/shared/lib"
import { PlusIcon } from "@/shared/ui"
import type { StatusMeta } from "../../constants"
import { TaskCard, type TaskCardProps } from "../TaskCard"
import styles from "./TaskColumn.module.css"

export type TaskColumnProps = Pick<TaskCardProps, "onOpen" | "onMove"> & {
	status: StatusMeta
	tasks: Task[]
	isFiltered: boolean
	onCreate: (status: TaskStatus) => void
}

export function TaskColumn({
	status,
	tasks,
	isFiltered,
	onOpen,
	onMove,
	onCreate,
}: TaskColumnProps) {
	const headingId = `column-${status.id}`

	return (
		<section
			className={cx(styles.column, styles[status.id])}
			aria-labelledby={headingId}
		>
			<h2 id={headingId} className={styles.title}>
				<span className={styles.dot} aria-hidden="true" />
				{status.title}
				<span
					className={styles.count}
					aria-label={`задач: ${tasks.length}`}
				>
					{tasks.length}
				</span>
			</h2>

			{tasks.length === 0 ? (
				<p className={styles.empty}>
					{isFiltered ? "Ничего не найдено" : "Нет задач"}
				</p>
			) : (
				<ul className={styles.list}>
					{tasks.map((task) => (
						<li key={task.id} className={styles.item}>
							<TaskCard
								task={task}
								onOpen={onOpen}
								onMove={onMove}
							/>
						</li>
					))}
				</ul>
			)}

			<button
				type="button"
				className={styles.create}
				onClick={() => onCreate(status.id)}
			>
				<PlusIcon size={14} />
				Создать задачу
			</button>
		</section>
	)
}
